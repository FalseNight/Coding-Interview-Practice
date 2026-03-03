class RateLimitedAPI {
  constructor(requestsPerSecond) {
    this.requestsPerSecond = requestsPerSecond;
    this.requestWindow = 1000; // 1 second in milliseconds
    this.requestTimestamps = []; // Timestamps of recent requests
    this.requestQueue = []; // Priority queue for pending requests
    this.activeRequests = 0;
    this.maxConcurrent = Math.max(1, requestsPerSecond); // Allow concurrency up to limit
    this.isProcessing = false;
    
    // For retry tracking
    this.retryDelays = [1000, 3000, 10000]; // Exponential backoff delays
  }
  
  async request(url, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body = null,
      priority = 0,
      retries = 3,
      timeout = 10000,
      abortSignal = null,
      onRetry = null
    } = options;
    
    return new Promise((resolve, reject) => {
      const requestData = {
        url,
        method,
        headers,
        body,
        priority,
        retries,
        timeout,
        abortSignal,
        onRetry,
        resolve,
        reject,
        attempt: 0
      };
      
      // Handle abort signal
      if (abortSignal) {
        const onAbort = () => {
          const index = this.requestQueue.findIndex(req => req === requestData);
          if (index !== -1) {
            this.requestQueue.splice(index, 1);
          }
          reject(new Error('Request aborted'));
        };
        
        if (abortSignal.aborted) {
          onAbort();
          return;
        }
        
        abortSignal.addEventListener('abort', onAbort);
        requestData.abortListener = onAbort;
      }
      
      // Add to priority queue (lower priority number = higher priority)
      this._enqueueRequest(requestData);
      
      // Start processing if not already
      if (!this.isProcessing) {
        this._processQueue();
      }
    });
  }
  
  _enqueueRequest(request) {
    // Insert in priority order (lower priority number first)
    let inserted = false;
    for (let i = 0; i < this.requestQueue.length; i++) {
      if (request.priority < this.requestQueue[i].priority) {
        this.requestQueue.splice(i, 0, request);
        inserted = true;
        break;
      }
    }
    
    if (!inserted) {
      this.requestQueue.push(request);
    }
  }
  
  async _processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0 && this._canMakeRequest()) {
      const request = this.requestQueue.shift();
      
      // Remove abort listener if request was dequeued
      if (request.abortSignal && request.abortListener) {
        request.abortSignal.removeEventListener('abort', request.abortListener);
      }
      
      this._makeRequest(request).finally(() => {
        this.activeRequests--;
        this._processQueue(); // Continue processing
      });
    }
    
    this.isProcessing = false;
  }
  
  _canMakeRequest() {
    // Check if we're under the concurrent request limit
    if (this.activeRequests >= this.maxConcurrent) {
      return false;
    }
    
    // Clean up old timestamps
    const now = Date.now();
    const windowStart = now - this.requestWindow;
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => timestamp > windowStart
    );
    
    // Check if we're under the rate limit
    return this.requestTimestamps.length < this.requestsPerSecond;
  }
  
  async _makeRequest(request) {
    const {
      url,
      method,
      headers,
      body,
      retries,
      timeout,
      abortSignal,
      onRetry,
      resolve,
      reject,
      attempt
    } = request;
    
    // Record this request timestamp
    this.requestTimestamps.push(Date.now());
    this.activeRequests++;
    
    try {
      // Create timeout controller
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(
        () => timeoutController.abort(),
        timeout
      );
      
      // Merge abort signals if provided
      let signal = timeoutController.signal;
      if (abortSignal) {
        const mergedController = new AbortController();
        signal = mergedController.signal;
        
        abortSignal.addEventListener('abort', () => mergedController.abort());
        timeoutController.signal.addEventListener('abort', () => mergedController.abort());
      }
      
      // Make the actual fetch request
      const fetchPromise = fetch(url, {
        method,
        headers,
        body,
        signal
      });
      
      const response = await fetchPromise;
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      resolve(response);
    } catch (error) {
      clearTimeout(request.timeoutId);
      
      // Check if we should retry
      const shouldRetry = 
        attempt < retries && 
        error.name !== 'AbortError' && 
        !abortSignal?.aborted;
      
      if (shouldRetry) {
        request.attempt++;
        
        if (onRetry) {
          onRetry(request.attempt, error);
        }
        
        // Calculate delay with exponential backoff
        const delay = this.retryDelays[Math.min(request.attempt - 1, this.retryDelays.length - 1)];
        
        // Requeue the request with delay
        setTimeout(() => {
          request.priority = Math.max(0, request.priority - 1); // Increase priority on retry
          this._enqueueRequest(request);
          this._processQueue();
        }, delay);
      } else {
        reject(error);
      }
    }
  }
  
  getQueueLength() {
    return this.requestQueue.length;
  }
  
  clearQueue() {
    // Reject all pending requests
    this.requestQueue.forEach(request => {
      if (request.abortSignal && request.abortListener) {
        request.abortSignal.removeEventListener('abort', request.abortListener);
      }
      request.reject(new Error('Queue cleared'));
    });
    
    this.requestQueue = [];
  }
}

module.exports = RateLimitedAPI;