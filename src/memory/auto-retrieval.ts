/**
 * Auto-retrieval memory system - automatically retrieves relevant memories
 * based on conversation context and injects them into the system prompt.
 */

import type { MemorySearchManager, MemorySearchResult } from "../memory-host-sdk/host/types.js";

export type AutoRetrievalConfig = {
  enabled: boolean;
  maxResults: number;
  minScore: number;
  maxChars: number;
  queryMode: "last_user" | "turn_context";
};

export type RetrievedMemory = {
  content: string;
  path: string;
  score: number;
  source: string;
};

export type FormattedRetrievedMemories = {
  text: string;
  count: number;
  totalChars: number;
};

const DEFAULT_AUTO_RETRIEVAL_CONFIG: AutoRetrievalConfig = {
  enabled: false,
  maxResults: 3,
  minScore: 0.5,
  maxChars: 2000,
  queryMode: "last_user",
};

/**
 * Resolves auto-retrieval configuration from memory search config.
 */
export function resolveAutoRetrievalConfig(
  memorySearchConfig: { autoRetrieval?: Partial<AutoRetrievalConfig> } | undefined,
): AutoRetrievalConfig {
  if (!memorySearchConfig?.autoRetrieval) {
    return { ...DEFAULT_AUTO_RETRIEVAL_CONFIG };
  }

  const config = memorySearchConfig.autoRetrieval;
  return {
    enabled: config.enabled ?? DEFAULT_AUTO_RETRIEVAL_CONFIG.enabled,
    maxResults: Math.max(
      1,
      Math.min(10, config.maxResults ?? DEFAULT_AUTO_RETRIEVAL_CONFIG.maxResults),
    ),
    minScore: Math.max(0, Math.min(1, config.minScore ?? DEFAULT_AUTO_RETRIEVAL_CONFIG.minScore)),
    maxChars: Math.max(
      100,
      Math.min(10000, config.maxChars ?? DEFAULT_AUTO_RETRIEVAL_CONFIG.maxChars),
    ),
    queryMode: config.queryMode ?? DEFAULT_AUTO_RETRIEVAL_CONFIG.queryMode,
  };
}

/**
 * Builds a search query based on the query mode and conversation context.
 */
export function buildAutoRetrievalQuery(params: {
  queryMode: "last_user" | "turn_context";
  lastUserMessage?: string;
  turnContext?: string;
}): string {
  if (params.queryMode === "turn_context" && params.turnContext?.trim()) {
    return params.turnContext.trim();
  }

  if (params.lastUserMessage?.trim()) {
    return params.lastUserMessage.trim();
  }

  return "";
}

/**
 * Retrieves relevant memories using the memory search manager.
 */
export async function retrieveRelevantMemories(params: {
  searchManager: MemorySearchManager;
  query: string;
  maxResults: number;
  minScore: number;
  sessionKey?: string;
}): Promise<RetrievedMemory[]> {
  if (!params.query.trim()) {
    return [];
  }

  try {
    const results = await params.searchManager.search(params.query, {
      maxResults: params.maxResults,
      minScore: params.minScore,
      sessionKey: params.sessionKey,
    });

    return results.map((result: MemorySearchResult) => ({
      content: result.snippet,
      path: result.path,
      score: result.score,
      source: result.source,
    }));
  } catch (error) {
    // Silently fail - auto-retrieval is best-effort
    return [];
  }
}

/**
 * Formats retrieved memories for inclusion in the system prompt.
 */
export function formatRetrievedMemories(params: {
  memories: RetrievedMemory[];
  maxChars: number;
}): FormattedRetrievedMemories {
  if (params.memories.length === 0) {
    return { text: "", count: 0, totalChars: 0 };
  }

  const sections: string[] = [];
  let totalChars = 0;
  let includedCount = 0;

  for (const memory of params.memories) {
    const formatted = formatSingleMemory(memory);
    const formattedChars = formatted.length;

    // Check if adding this memory would exceed the limit
    if (totalChars + formattedChars > params.maxChars && includedCount > 0) {
      break;
    }

    sections.push(formatted);
    totalChars += formattedChars;
    includedCount++;

    // If this single memory exceeded the limit, we still include it
    // but stop processing further memories
    if (totalChars >= params.maxChars) {
      break;
    }
  }

  const header = `## Auto-Retrieved Memories (${includedCount} relevant memory${includedCount !== 1 ? "ies" : "y"} from conversation context)`;
  const footer = "---";

  const text = sections.length > 0 ? `${header}\n\n${sections.join("\n\n")}\n\n${footer}` : "";

  return {
    text,
    count: includedCount,
    totalChars: text.length,
  };
}

function formatSingleMemory(memory: RetrievedMemory): string {
  const pathInfo = memory.path ? ` (${memory.path})` : "";
  const scoreInfo = `[score: ${memory.score.toFixed(2)}]`;

  return `**Memory${pathInfo}** ${scoreInfo}:\n${memory.content}`;
}
