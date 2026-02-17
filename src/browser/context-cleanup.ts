/**
 * Context cleanup utilities to prevent renderer process leaks.
 *
 * The leak occurs because BrowserContexts are never closed, even after all
 * their pages are closed. Chromium keeps renderer processes alive in the
 * context until the context is explicitly closed.
 */

import type { Browser } from "playwright-core";

/**
 * Close any empty contexts (contexts with no pages).
 * Returns the number of contexts closed.
 */
export async function closeEmptyContexts(browser: Browser): Promise<number> {
  let closedCount = 0;
  const contexts = browser.contexts();

  for (const context of contexts) {
    const pages = context.pages();
    if (pages.length === 0) {
      try {
        await context.close();
        closedCount++;
      } catch (err) {
        console.error("Failed to close empty context:", err);
      }
    }
  }

  return closedCount;
}

/**
 * Get total renderer process count across all contexts.
 * Useful for monitoring and alerting.
 */
export function getContextStats(browser: Browser): {
  contextCount: number;
  totalPages: number;
  emptyContexts: number;
} {
  const contexts = browser.contexts();
  let totalPages = 0;
  let emptyContexts = 0;

  for (const context of contexts) {
    const pages = context.pages();
    totalPages += pages.length;
    if (pages.length === 0) {
      emptyContexts++;
    }
  }

  return {
    contextCount: contexts.length,
    totalPages,
    emptyContexts,
  };
}
