/**
 * Generates a unique token identifier (jti).
 * Jti = JSON Token Identifier
 */
export class JtiGenerator {
  /**
   * Generates a unique token identifier (jti).
   *
   * @returns {string} The generated jti string.
   */
  generate () {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9)
  }
}
