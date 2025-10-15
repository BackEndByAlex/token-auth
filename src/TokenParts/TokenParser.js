import { Base64Url } from '../base64Url.js'

/**
 * Parses and decodes JWT tokens.
 */
export class TokenParser {
  static #EXPECTED_PARTS_LENGTH = 3

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
   * Decodes the header and payload parts of a JWT token.
   *
   * @param {string[]} parts - Array containing the encoded header, payload, and signature.
   * @returns {object} Decoded header, payload, and their encoded forms.
   */
  decodeTokenParts (parts) {
    const [headerEncoded, payloadEncoded] = parts
    return {
      header: this.#decodeJson(headerEncoded),
      payload: this.#decodeJson(payloadEncoded),
      headerEncoded,
      payloadEncoded
    }
  }

  // private methods

  #isLengthThree (parts) {
    return parts.length === TokenParser.#EXPECTED_PARTS_LENGTH
  }

  /**
   * Decodes a base64url-encoded JSON string.
   */
  #decodeJson (encoded) {
    const jsonString = this.base64Url.decode(encoded)
    return JSON.parse(jsonString)
  }
}
