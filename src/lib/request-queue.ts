/**
 * Request Queue System
 * Manages API requests with rate limiting and queuing
 * Prevents overwhelming APIs and ensures fair resource usage
 */

interface QueuedRequest {
  id: string;
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  priority: number; // Higher priority = processed first
  timestamp: number;
}

interface QueueConfig {
  maxConcurrent: number;
  rateLimitRPM: number;
  rateLimitWindowMs: number;
  timeoutMs: number;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private processing: Set<string> = new Set();
  private rateLimitMap: Map<string, { count: number; resetAt: number }> = new Map();
  private config: QueueConfig;

  constructor(config: QueueConfig) {
    this.config = config;
    this.startProcessor();
  }

  /**
   * Add a request to the queue
   */
  async enqueue<T>(
    execute: () => Promise<T>,
    priority: number = 0,
    identifier: string = 'default'
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const request: QueuedRequest = {
        id: `${identifier}-${Date.now()}-${Math.random()}`,
        execute,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex(r => r.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(request);
      } else {
        this.queue.splice(insertIndex, 0, request);
      }
    });
  }

  /**
   * Check if we can process a request (rate limit check)
   */
  private canProcess(identifier: string = 'default'): boolean {
    const now = Date.now();
    const entry = this.rateLimitMap.get(identifier);

    if (!entry || now > entry.resetAt) {
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetAt: now + this.config.rateLimitWindowMs
      });
      return true;
    }

    if (entry.count >= this.config.rateLimitRPM) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    // Don't process if we're at max concurrent
    if (this.processing.size >= this.config.maxConcurrent) {
      return;
    }

    // Get next request from queue
    const request = this.queue.shift();
    if (!request) {
      return;
    }

    // Check rate limit
    if (!this.canProcess('default')) {
      // Put request back at front of queue
      this.queue.unshift(request);
      return;
    }

    // Process request
    this.processing.add(request.id);

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${this.config.timeoutMs}ms`)), this.config.timeoutMs);
    });

    // Execute request with timeout
    Promise.race([request.execute(), timeoutPromise])
      .then(result => {
        request.resolve(result);
      })
      .catch(error => {
        request.reject(error);
      })
      .finally(() => {
        this.processing.delete(request.id);
        // Process next request
        setImmediate(() => this.processQueue());
      });
  }

  /**
   * Start the queue processor
   */
  private startProcessor(): void {
    // Process queue every 100ms
    setInterval(() => {
      this.processQueue();
    }, 100);
  }

  /**
   * Get queue status
   */
  getStatus(): {
    queued: number;
    processing: number;
    total: number;
  } {
    return {
      queued: this.queue.length,
      processing: this.processing.size,
      total: this.queue.length + this.processing.size
    };
  }
}

// Create default queues for different API types
export const openaiQueue = new RequestQueue({
  maxConcurrent: 5,
  rateLimitRPM: 3500,
  rateLimitWindowMs: 60 * 1000,
  timeoutMs: 30000
});

export const groqQueue = new RequestQueue({
  maxConcurrent: 3,
  rateLimitRPM: 30,
  rateLimitWindowMs: 60 * 1000,
  timeoutMs: 20000
});

export const geminiQueue = new RequestQueue({
  maxConcurrent: 2,
  rateLimitRPM: 15,
  rateLimitWindowMs: 60 * 1000,
  timeoutMs: 20000
});

/**
 * Helper function to queue an API call
 */
export async function queueRequest<T>(
  execute: () => Promise<T>,
  provider: 'openai' | 'groq' | 'gemini' = 'openai',
  priority: number = 0
): Promise<T> {
  const queue = provider === 'openai' ? openaiQueue : provider === 'groq' ? groqQueue : geminiQueue;
  return queue.enqueue(execute, priority);
}

