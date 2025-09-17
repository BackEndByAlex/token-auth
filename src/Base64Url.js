/**
 * Utility class for encoding and decoding base64url strings.
 */
export class Base64Url {
  /**
   * The function encodes the input string to base64 using btoa.
   * It then replaces '+' with '-', '/' with '_', and removes any trailing '=' characters to convert from base64 to base64url.
   * Finally, it returns the modified string.
   *
   * @param {string} input - The input string to encode.
   * @returns {string} The base64url-encoded string.
   */
  encode (input) {
    try {
      const base64 = btoa(input)
      const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      return base64Url
    } catch (error) {
      throw new Error('Failed to encode to Base64Url')
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
    try {
      // Validate input first
      if (!input || typeof input !== 'string') {
        throw new Error('Input must be a non-empty string')
      }

      if (!/^[A-Za-z0-9_-]*$/.test(input)) {
        throw new Error('Invalid base64url characters')
      }
      const decode = input.replace(/-/g, '+').replace(/_/g, '/')
      const padding = decode.length % 4 === 0 ? '' : '='.repeat(4 - (decode.length % 4))
      return atob(decode + padding)
    } catch (error) {
      if (error.message.includes('base64url') || error.message.includes('Input must')) {
        throw error
      }
      throw new Error('Failed to decode Base64Url')
    }
  }
}
