// Minimal Chaos Engineering Circuit Breaker Standard Template

class CircuitBreaker {
  constructor(request, options = {}) {
    this.request = request;
    this.state = 'CLOSED';
    this.failureThreshold = options.failureThreshold || 3;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 5000;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }

  async fire(...args) {
    if (this.state === 'OPEN') {
      if (this.nextAttempt <= Date.now()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit Breaker is OPEN. Request halted by Chaos Engine Guard.');
      }
    }

    try {
      const response = await this.request(...args);
      return this.success(response);
    } catch (err) {
      return this.fail(err);
    }
  }

  success(response) {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount > this.successThreshold) {
        this.successCount = 0;
        this.state = 'CLOSED';
      }
    }
    this.failureCount = 0;
    return response;
  }

  fail(err) {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
    throw err;
  }
}

module.exports = CircuitBreaker;
