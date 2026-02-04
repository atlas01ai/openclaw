/**
 * Auto-Retrieval Layer for Memory
 *
 * This module provides automatic memory retrieval that injects relevant
 * context into the system prompt before each agent turn.
 *
 * The goal: Memory should come to me, not just be available if I look.
 *
 * IMPORTANT NOTES:
 * - Must be explicitly enabled via config (agents.defaults.memorySearch.autoRetrieval.enabled)
 * - Adds latency: one embedding API call per user message
 * - Adds tokens: up to maxTokens (default 800) per turn
 * - No deduplication with contextFiles: if MEMORY.md is also loaded as a context file,
 *   content may appear twice. Consider excluding MEMORY.md from contextFiles when
 *   auto-retrieval is enabled, or accept some redundancy.
 */

import type { OpenClawConfig } from "../config/config.js";
import type { MemorySearchResult } from "./types.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { getMemorySearchManager } from "./index.js";

const log = createSubsystemLogger("memory:auto-retrieval");

export interface AutoRetrievalConfig {
  enabled: boolean;
  maxTokens: number;
  maxResults: number;
  minScore: number;
}

export interface AutoRetrievalResult {
  snippets: MemorySearchResult[];
  totalTokens: number;
  query: string;
  skipped?: string;
}

const DEFAULT_CONFIG: AutoRetrievalConfig = {
  enabled: false, // Must be explicitly enabled
  maxTokens: 800,
  maxResults: 5,
  minScore: 0.25,
};

/**
 * Estimate tokens for a snippet (rough: ~4 chars per token)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Extract the most relevant query from the user message.
 * For now, just use the full message. Future: could extract key phrases.
 */
function extractQuery(message: string): string {
  // Trim and limit query length to avoid embedding API issues
  const trimmed = message.trim();
  if (trimmed.length > 1000) {
    return trimmed.slice(0, 1000);
  }
  return trimmed;
}

/**
 * Check if auto-retrieval should be skipped for this message.
 * Skip for very short messages, commands, or heartbeats.
 */
function shouldSkipRetrieval(message: string): string | null {
  const trimmed = message.trim();

  // Skip empty or very short messages
  if (trimmed.length < 10) {
    return "message too short";
  }

  // Skip slash commands
  if (trimmed.startsWith("/")) {
    return "slash command";
  }

  // Skip heartbeat polls
  if (trimmed.toLowerCase().includes("heartbeat") && trimmed.includes("HEARTBEAT.md")) {
    return "heartbeat poll";
  }

  // Skip if message is just an emoji or reaction
  if (/^[\p{Emoji}\s]+$/u.test(trimmed) && trimmed.length < 20) {
    return "emoji only";
  }

  return null;
}

/**
 * Resolve auto-retrieval config from OpenClaw config.
 * Returns null unless explicitly enabled via config.
 */
export function resolveAutoRetrievalConfig(
  cfg: OpenClawConfig | undefined,
  agentId: string,
): AutoRetrievalConfig | null {
  if (!cfg) {
    return null;
  }

  const agentConfig = cfg.agents?.items?.[agentId];
  const defaults = cfg.agents?.defaults;

  // Check if memory search is enabled (required for auto-retrieval)
  const memorySearchEnabled =
    agentConfig?.memorySearch?.enabled ?? defaults?.memorySearch?.enabled ?? false;

  if (!memorySearchEnabled) {
    return null;
  }

  // Get auto-retrieval specific config
  const autoRetrieval =
    agentConfig?.memorySearch?.autoRetrieval ?? defaults?.memorySearch?.autoRetrieval;

  // Auto-retrieval must be EXPLICITLY enabled - not enabled by default
  if (!autoRetrieval?.enabled) {
    return null;
  }

  // Validate and clamp config values to safe ranges
  const maxTokens = Math.max(
    100,
    Math.min(2000, autoRetrieval.maxTokens ?? DEFAULT_CONFIG.maxTokens),
  );
  const maxResults = Math.max(
    1,
    Math.min(10, autoRetrieval.maxResults ?? DEFAULT_CONFIG.maxResults),
  );
  const minScore = Math.max(0, Math.min(1, autoRetrieval.minScore ?? DEFAULT_CONFIG.minScore));

  return {
    enabled: true, // We know it's enabled if we got here
    maxTokens,
    maxResults,
    minScore,
  };
}

/**
 * Retrieve relevant memories for the incoming message.
 * This is the main entry point for auto-retrieval.
 */
export async function retrieveRelevantMemories(params: {
  cfg: OpenClawConfig;
  agentId: string;
  message: string;
  sessionKey?: string;
  config?: Partial<AutoRetrievalConfig>;
}): Promise<AutoRetrievalResult> {
  const { cfg, agentId, message, sessionKey } = params;

  // Resolve config
  const resolvedConfig = resolveAutoRetrievalConfig(cfg, agentId);
  const config = {
    ...DEFAULT_CONFIG,
    ...resolvedConfig,
    ...params.config,
  };

  const query = extractQuery(message);

  // Check if we should skip
  const skipReason = shouldSkipRetrieval(message);
  if (skipReason) {
    log.debug(`auto-retrieval skipped: ${skipReason}`);
    return {
      snippets: [],
      totalTokens: 0,
      query,
      skipped: skipReason,
    };
  }

  // Get memory search manager
  const { manager, error } = await getMemorySearchManager({ cfg, agentId });
  if (!manager) {
    log.debug(`auto-retrieval unavailable: ${error ?? "no manager"}`);
    return {
      snippets: [],
      totalTokens: 0,
      query,
      skipped: error ?? "memory search unavailable",
    };
  }

  try {
    // Run semantic search
    const results = await manager.search(query, {
      maxResults: config.maxResults * 2, // Get extra, then filter by tokens
      minScore: config.minScore,
      sessionKey,
    });

    // Filter and trim to token budget
    const snippets: MemorySearchResult[] = [];
    let totalTokens = 0;

    for (const result of results) {
      const snippetTokens = estimateTokens(result.snippet);
      if (totalTokens + snippetTokens > config.maxTokens) {
        // Stop if we'd exceed budget
        break;
      }
      snippets.push(result);
      totalTokens += snippetTokens;

      if (snippets.length >= config.maxResults) {
        break;
      }
    }

    log.debug(
      `auto-retrieval: ${snippets.length} snippets, ~${totalTokens} tokens for query: "${query.slice(0, 50)}..."`,
    );

    return {
      snippets,
      totalTokens,
      query,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    log.warn(`auto-retrieval failed: ${errorMessage}`);
    return {
      snippets: [],
      totalTokens: 0,
      query,
      skipped: `error: ${errorMessage}`,
    };
  }
}

/**
 * Format retrieved memories for injection into system prompt.
 */
export function formatRetrievedMemories(result: AutoRetrievalResult): string | null {
  if (result.snippets.length === 0) {
    return null;
  }

  const lines: string[] = [
    "## Recalled Memories",
    "",
    "The following memories were automatically retrieved based on the current conversation:",
    "",
  ];

  for (const snippet of result.snippets) {
    const source = snippet.path;
    const lineInfo =
      snippet.startLine && snippet.endLine
        ? `:${snippet.startLine}-${snippet.endLine}`
        : snippet.startLine
          ? `:${snippet.startLine}`
          : "";
    const score = snippet.score.toFixed(2);

    lines.push(`### ${source}${lineInfo} (relevance: ${score})`);
    lines.push("");
    lines.push(snippet.snippet.trim());
    lines.push("");
  }

  lines.push("*These memories surfaced automatically. Use memory_search for deeper exploration.*");
  lines.push("");

  return lines.join("\n");
}
