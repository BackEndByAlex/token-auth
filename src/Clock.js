/**
 * Represents a clock utility for retrieving the current time in seconds.
 */
export class Clock {
  static #SECONDS_IN_MILLISECOND = 1000

  /**
   * Returns the current Unix timestamp in seconds.
   *
   * @returns {number} Current timestamp in seconds.
   */
  now () {
    return Math.floor(Date.now() / Clock.#SECONDS_IN_MILLISECOND)
  }
}
