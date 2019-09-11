/**
 * A class to represent the Circuit breaker pattern. To use pass a request object
 * to callService()
 * @class
 *
 * @property states object to store the state of each request
 * @property failureThreshold number of failed requests before setting open circuit
 * @property cooldownPeriod seconds to wait until trying request after circuit opened
 * @property requestTimeout time in seconds before a request is deemed as failed
 */

// Note: install axios if using the circuitbreaker
const axios = require('axios');

/**
 * CircutiBreaker to handle failed requests.
 */
class CircuitBreaker {
  /**
   * @contructor
   * @param {Object} config settings
   */
  constructor(config) {
    this.states = {};
    this.failureThreshold = config.failureThreshold || 3;
    this.cooldownPeriod = config.cooldownPeriod || 30;
    this.requestTimeout = config.timeout || 1;
  }

  /** callService attempts to send a request to an endpoint and records success or failure
   * @param  {object} requestOptions the request to make
   * @return {object|boolean} response.data or false if failed or can't make request
   */
  async callService(requestOptions) {
    const endpoint = `${requestOptions.method}:${requestOptions.url}`;
    if (!this.canRequest(endpoint)) return false;

    // eslint-disable-next-line no-param-reassign
    requestOptions.timeout = this.requestTimeout * 1000;

    try {
      const response = await axios(requestOptions);
      this.onSuccess(endpoint);
      return response.data;
    } catch (err) {
      this.onFailure(endpoint);
      return false;
    }
  }

  /** onSuccess resets an endpoint to initial values
   * @param  {string} endpoint
   */
  onSuccess(endpoint) {
    this.initState(endpoint);
  }

  /** onFailure sets errors states for a failed request to the endpoint
   * @param  {string} endpoint
   */
  onFailure(endpoint) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = 'OPEN';
      state.nextTry = new Date() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for ${endpoint} is in state 'OPEN'`);
    }
  }

  /** canRequest checks to see if the endpoint's state allows for requests
   * @param  {string} endpoint
   * @return {boolean} true if circuit is closed or half open, false otherwise
   */
  canRequest(endpoint) {
    if (!this.states[endpoint]) this.initState(endpoint);
    const state = this.states[endpoint];
    if (state.circuit === 'CLOSED') return true;
    const now = new Date() / 1000;
    if (state.nextTry <= now) {
      state.circuit = 'HALF';
      return true;
    }
    return false;
  }

  /** initState for the endpoint
   * @param  {string} endpoint
   */
  initState(endpoint) {
    this.states[endpoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: 'CLOSED',
      nextTry: 0,
    };
  }
}

module.exports = CircuitBreaker;
