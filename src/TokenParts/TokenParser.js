import { Base64Url } from '../base64Url.js'

/**
 * A class for parsing and decoding JWT tokens.
 */
export class TokenParser {
  /**
   * Creates an instance of TokenParser.
   *
   */
  constructor () {
    this.base64Url = new Base64Url()
  }

  /**
   * Splits a JWT token into its component parts.
   *
   * @param {string} token - The JWT token to split.
   * @returns {string[]} An array containing the header, payload, and signature.
   * @throws {Error} If the token format is invalid.
   */
  parseTokenParts (token) {
    const parts = token.split('.')

    if (!this.#isLengthThree(parts)) {
      throw new Error('Invalid token format')
    }

    return parts
  }

  /**
   * Checks if the parts array has exactly three elements.
   *
   * @param {string[]} parts - The array to check.
   * @returns {boolean} True if the array has three elements, false otherwise.
   */
  #isLengthThree (parts) {
    return parts.length === 3
  }

  /**
   * Decodes the header and payload parts of a JWT token.
   *
   * @param {string[]} parts - Array containing the encoded header, payload, and signature.
   * @returns {object} An object with decoded header, payload, and their encoded forms.
   */
  decodeTokenParts (parts) {
    const [headerEncoded, payloadEncoded] = parts
    return {
      header: JSON.parse(this.base64Url.decode(headerEncoded)),
      payload: JSON.parse(this.base64Url.decode(payloadEncoded)),
      headerEncoded,
      payloadEncoded
    }
  }
}
