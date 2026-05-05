/**
 * Browser Request Queue - Serialized request processing for browser operations
 *
 * Prevents race conditions and resource contention when multiple requests
 * target the same browser context simultaneously.
 */

import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("browser").child("queue");

export type BrowserQueueTask<T> = () => Promise<T>;

export class BrowserRequestQueue {
  private queue: Array<{
    task: BrowserQueueTask<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];
  private running = false;
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async enqueue<T>(task: BrowserQueueTask<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task: task as BrowserQueueTask<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      void this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) {
        continue;
      }

      try {
        log.debug(`[${this.name}] Processing task, queue depth: ${this.queue.length}`);
        const result = await item.task();
        item.resolve(result);
      } catch (err) {
        log.debug(`[${this.name}] Task failed: ${String(err)}`);
        item.reject(err);
      }
    }

    this.running = false;
  }

  get depth(): number {
    return this.queue.length;
  }

  get isRunning(): boolean {
    return this.running;
  }
}

// Global queue instances per CDP endpoint
const queuesByCdpUrl = new Map<string, BrowserRequestQueue>();

export function getBrowserQueue(cdpUrl: string): BrowserRequestQueue {
  const normalized = cdpUrl.replace(/\/$/, "");
  let queue = queuesByCdpUrl.get(normalized);
  if (!queue) {
    queue = new BrowserRequestQueue(normalized);
    queuesByCdpUrl.set(normalized, queue);
  }
  return queue;
}

export function clearBrowserQueue(cdpUrl: string): void {
  const normalized = cdpUrl.replace(/\/$/, "");
  queuesByCdpUrl.delete(normalized);
}
