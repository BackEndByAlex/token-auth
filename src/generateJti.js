/**
 * Generates a unique token identifier.
 * 
 * Format: timestamp + random alphanumeric string
 */
export class JtiGenerator {
  static RANDOM_STRING_LENGTH = 7
  static BASE36_RADIX = 36
  static RANDOM_PREFIX_LENGTH = 2 // to skip '0.'


  /**
   * Generates a unique token identifier.
   * 
   * Combines current timestamp with a random alphanumeric string.
   *
   * @returns {string} The generated token identifier.
   */
  generateJti () {
    const timestamp = this.#getTimestamp()
    const randomPart = this.#generateRandomString()
    return timestamp + randomPart
  }

  // private methods

  #getTimestamp () {
    return Date.now().toString()
  }

  #generateRandomString () {
    return Math.random()
      .toString(JtiGenerator.BASE36_RADIX)
      .substring(
        JtiGenerator.RANDOM_PREFIX_LENGTH,
        JtiGenerator.RANDOM_PREFIX_LENGTH + JtiGenerator.RANDOM_STRING_LENGTH
      )
  }
}
