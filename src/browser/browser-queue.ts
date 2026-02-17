/**
 * Browser request queue to prevent concurrent access and ensure context cleanup.
 *
 * Problem: OpenClaw was using a shared, persistent BrowserContext that was never
 * closed, causing Chrome renderer processes to accumulate (76 processes = 3.5GB).
 *
 * Solution: Serialize browser requests and create fresh contexts that are always
 * cleaned up in finally blocks.
 *
 * Performance: Acceptable for agent workloads (async, minutes apart).
 * Evolution: Can add pooling later if metrics show contention.
 */

import type { Browser, BrowserContext } from "playwright-core";

type QueuedRequest<T> = {
  task: (context: BrowserContext) => Promise<T>;
  resolve: (result: T) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
  timestamp: number;
};

const DEFAULT_TIMEOUT_MS = 120_000; // 2 minutes

export class BrowserRequestQueue {
  private queue: QueuedRequest<unknown>[] = [];
  private processing = false;
  private browser: Browser | null = null;

  /**
   * Execute a browser task with guaranteed context cleanup.
   *
   * @param browser - Playwright Browser instance
   * @param task - Function that receives a fresh BrowserContext
   * @param timeoutMs - Maximum execution time (default: 120s)
   * @returns Promise resolving to task result
   */
  async execute<T>(
    browser: Browser,
    task: (context: BrowserContext) => Promise<T>,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
  ): Promise<T> {
    this.browser = browser;

    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Browser task timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      const request: QueuedRequest<T> = {
        task,
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        timeout,
        timestamp: Date.now(),
      };

      this.queue.push(request as QueuedRequest<unknown>);
      void this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (!request || !this.browser) {
        continue;
      }

      // Create fresh context for this request
      let context: BrowserContext | null = null;
      try {
        context = await this.browser.newContext();
        const result = await request.task(context);
        request.resolve(result);
      } catch (error) {
        request.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        // CRITICAL: Always close context to free renderer processes
        if (context) {
          await context.close().catch((err) => {
            console.error("Failed to close browser context:", err);
          });
        }
      }
    }

    this.processing = false;
  }

  /**
   * Get current queue depth for monitoring.
   */
  getQueueDepth(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is currently processing.
   */
  isProcessing(): boolean {
    return this.processing;
  }

  /**
   * Clear all pending requests (useful for shutdown).
   */
  clear(): void {
    for (const request of this.queue) {
      clearTimeout(request.timeout);
      request.reject(new Error("Browser queue cleared"));
    }
    this.queue = [];
  }
}

// Global singleton queue for the browser service
let globalQueue: BrowserRequestQueue | null = null;

/**
 * Get or create the global browser request queue.
 */
export function getBrowserQueue(): BrowserRequestQueue {
  if (!globalQueue) {
    globalQueue = new BrowserRequestQueue();
  }
  return globalQueue;
}

/**
 * Reset the global queue (for testing or shutdown).
 */
export function resetBrowserQueue(): void {
  if (globalQueue) {
    globalQueue.clear();
  }
  globalQueue = null;
}
