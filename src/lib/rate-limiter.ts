export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private queue: Array<() => void> = [];
  
  constructor(maxTokens: number, refillIntervalMs: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    
    // Refill tokens periodically
    setInterval(() => {
      this.tokens = this.maxTokens;
      this.processQueue();
    }, refillIntervalMs);
  }
  
  private processQueue() {
    while (this.queue.length > 0 && this.tokens > 0) {
      this.tokens--;
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }

  /**
   * Acquires a token to run an API request.
   * @param onQueued Optional callback fired if the request has to wait in the queue.
   * @returns a boolean indicating if it was acquired immediately (true) or after queuing (false).
   */
  async acquire(onQueued?: () => void): Promise<boolean> {
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    
    if (onQueued) onQueued();
    
    return new Promise<boolean>((resolve) => {
      this.queue.push(() => resolve(false));
    });
  }
}

// Global rate limiter singleton: 10 requests per minute to stay under the 15 RPM free tier limit
export const globalRateLimiter = new RateLimiter(10, 60000);
