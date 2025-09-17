/**
 * Represents a clock utility for retrieving the current time in seconds.
 */
export class Clock {
  /**
   * Returns the current time in seconds since the Unix epoch.
   *
   * @returns {number} The current time in seconds.
   */
  nowSeconds () {
    return Math.floor(Date.now() / 1000)
  }
}
