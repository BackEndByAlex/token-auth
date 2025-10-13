import { Clock } from '../clock.js'

/**
 * Validates JWT tokens for expiration, revocation, and signature.
 */
export class TokenValidator {
  constructor (revocationStore, signatureManager) {
    this.revocationStore = revocationStore
    this.signatureManager = signatureManager
    this.clock = new Clock()
  }

  /**
   * Validates the decoded JWT token parts, checks revocation and signature.
   *
   * @param {string[]} parts - Array containing the encoded header, payload, and signature.
   * @param {object} decoded - Object containing decoded header, payload, and their encoded forms.
   * @param {object} decoded.header - The decoded JWT header object.
   * @param {object} decoded.payload - The decoded JWT payload object.
   * @param {string} decoded.headerEncoded - The base64url encoded JWT header.
   * @param {string} decoded.payloadEncoded - The base64url encoded JWT payload.
   * @returns {object} An object with 'valid' boolean and either 'payload' or 'error'.
   */
  validateTokenParts (parts, { header, payload, headerEncoded, payloadEncoded }) {
    if (this.#isTokenExpired(payload)) {
      return { valid: false, error: 'Token expired' }
    }

    if (this.#ifTokenRevoked(payload)) {
      return { valid: false, error: 'Token revoked' }
    }

     if (!this.#hasValidSignature(parts, header, headerEncoded, payloadEncoded)) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true, payload }
  }

    /**
   * Validates that a token can be refreshed.
   * 
   * Allows refresh of expired tokens but not revoked or invalid tokens.
   *
   * @param {object} verification - Result from verifyToken().
   * @throws {Error} If the token is invalid or expired.
   */
  validateTokenForRefresh (verification) {
    if (!verification.valid && verification.error !== 'Token expired') {
      throw new Error(`Cannot refresh token: ${verification.error}`)
    }
  }

  // private methods

  #isTokenExpired (payload) {
    return payload.exp < this.clock.now()
  }

  /**
   * Checks if the token has been revoked.
   */
  #ifTokenRevoked (payload) {
    return this.revocationStore.isRevoked(payload.jti)
  }

  /**
   * Verifies the token's signature using the signature manager.
   * 
   * @param {string[]} parts - The JWT token parts.
   * @param {object} header - The decoded JWT header.
   * @param {string} headerEncoded - The base64url encoded JWT header.
   * @param {string} payloadEncoded - The base64url encoded JWT payload.
   * @returns {boolean} True if the signature is valid, false otherwise.
   */
  #hasValidSignature (parts, header, headerEncoded, payloadEncoded) {
    const signedData = `${headerEncoded}.${payloadEncoded}`
    const signature = parts[2]
    const kid = header.kid

    return this.signatureManager.verify(signedData, signature, kid)
  }
}
