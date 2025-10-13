/**
 * Encoder/decoder for base64url format.
 * 
 * Base64url is a URL-safe variant of base64 that:
 * - Replaces '+' with '-'
 * - Replaces '/' with '_'
 * - Omits padding '=' characters
 */
export class Base64Url {
  static BASE64URL_REGEX = /^[A-Za-z0-9_-]*$/
  static BASE64_PADDING_MODULO = 4


  /**
   * Encodes a string to base64url format.
   *
   * @param {string} input - The string to encode.
   * @returns {string} The base64url-encoded string.
   * @throws {Error} If encoding fails (e.g., invalid Unicode characters).
   */
  encode (input) {
    try {
      const base64 = btoa(input)
      return this.#convertBase64ToBase64Url(base64)
    } catch (error) {
      throw new Error(`Failed to encode to base64url: ${error.message}`)
    }
  }

  /**
   * Decodes a base64url-encoded string back to its original string.
   *
   * @param {string} input - The base64url-encoded string to decode.
   * @returns {string} The decoded string.
   * @throws {Error} If the input is invalid or decoding fails.
   */
  decode (input) {
    this.#validateInput(input)
    this.#validateBase64UrlCharacters(input)

    try {
      const base64 = this.#convertBase64UrlToBase64(input)
      return atob(base64)
    } catch (error) {
      throw new Error(`Failed to decode base64url: ${error.message}`)
    }
  }

  // private methods

  #convertBase64ToBase64Url (base64) {
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  #convertBase64UrlToBase64 (base64Url) {
    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    
    return this.#addPadding(base64)
  }

  #addPadding (base64) {
    const paddingLength = this.#calculatePaddingLength(base64.length)
    return paddingLength === 0
      ? base64
      : base64 + '='.repeat(paddingLength)
  }

  #calculatePaddingLength (length) {
    const remainder = length % Base64Url.BASE64_PADDING_MODULO
    return remainder === 0 ? 0 : Base64Url.BASE64_PADDING_MODULO - remainder
  }

  #validateInput (input) {
    if (!input || typeof input !== 'string') {
      throw new Error('Input must be a non-empty string')
    }
  }

  #validateBase64UrlCharacters (input) {
    if (!Base64Url.BASE64URL_REGEX.test(input)) {
      throw new Error('Input contains invalid base64url characters')
    }
  }
}

