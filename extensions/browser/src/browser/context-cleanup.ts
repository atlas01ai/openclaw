/**
 * Browser Context Cleanup Utilities
 *
 * Manages cleanup of browser contexts when all pages are closed,
 * preventing resource leaks and memory accumulation.
 */

import type { Browser, BrowserContext } from "playwright-core";
import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("browser").child("cleanup");

/**
 * Check if a browser context has any remaining pages.
 */
export function contextHasPages(context: BrowserContext): boolean {
  try {
    const pages = context.pages();
    return pages.length > 0;
  } catch {
    // If we can't check, assume it's closed
    return false;
  }
}

/**
 * Safely close a browser context if it has no pages.
 * Returns true if context was closed, false otherwise.
 */
export async function closeContextIfEmpty(context: BrowserContext): Promise<boolean> {
  if (!contextHasPages(context)) {
    try {
      await context.close();
      log.debug("Closed empty browser context");
      return true;
    } catch (err) {
      // Context may already be closing/closed
      log.debug(`Context close failed (may already be closed): ${String(err)}`);
      return false;
    }
  }
  return false;
}

/**
 * Get all contexts from a browser that are candidates for cleanup.
 */
export function getEmptyContexts(browser: Browser): BrowserContext[] {
  try {
    return browser.contexts().filter((ctx) => !contextHasPages(ctx));
  } catch {
    return [];
  }
}

/**
 * Close all empty contexts in a browser.
 * Returns count of contexts closed.
 */
export async function closeAllEmptyContexts(browser: Browser): Promise<number> {
  const emptyContexts = getEmptyContexts(browser);
  let closed = 0;

  for (const context of emptyContexts) {
    if (await closeContextIfEmpty(context)) {
      closed++;
    }
  }

  return closed;
}

/**
 * Check if browser has any remaining contexts with pages.
 */
export function browserHasActiveContexts(browser: Browser): boolean {
  try {
    const contexts = browser.contexts();
    return contexts.some((ctx) => contextHasPages(ctx));
  } catch {
    return false;
  }
}
