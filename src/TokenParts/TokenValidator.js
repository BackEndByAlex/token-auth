import { Clock } from '../clock.js'

/**
 * Class responsible for validating JWT tokens, including revocation and signature checks.
 */
export class TokenValidator {
  /**
   * Creates an instance of TokenValidator.
   *
   * @param {object} revocationStore - The store used to check if a token has been revoked.
   * @param {object} signatureManager - The manager used to verify token signatures.
   */
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
    if (this.#expireToken(payload)) {
      return { valid: false, error: 'Token expired' }
    }

    if (this.#ifTokenRevoked(payload)) {
      return { valid: false, error: 'Token revoked' }
    }

    const dataVerify = `${headerEncoded}.${payloadEncoded}`
    const isValid = this.signatureManager.verify(dataVerify, parts[2], header.kid)

    return { valid: isValid, payload }
  }

  /**
   * Checks if the token has been revoked based on the payload's 'jti' claim.
   *
   * @param {object} payload - The JWT payload object.
   * @returns {object|undefined} Returns an object with 'valid' and 'error' if revoked, otherwise undefined.
   */
  #ifTokenRevoked (payload) {
    return this.revocationStore.checkIfRevoked(payload.jti)
  }

  /**
   * Checks if the token is expired based on the payload's 'exp' claim.
   *
   * @param {object} payload - The JWT payload object.
   * @returns {object|undefined} Returns an object with 'valid' and 'error' if expired, otherwise undefined.
   */
  #expireToken (payload) {
    return payload.exp < this.clock.getTimeInSeconds()
  }

  /**
   * Validates a token verification result for refresh eligibility.
   *
   * @param {object} verification - The verification result object.
   * @throws {Error} If the token is invalid or expired.
   */
  validateTokenForRefresh (verification) {
    if (!verification.valid && verification.error !== 'Token expired') {
      throw new Error('Invalid token')
    }
  }
}
