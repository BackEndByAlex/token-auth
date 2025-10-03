import { Base64Url } from '../base64Url.js'

/**
 * TokenBuilder is responsible for creating JWT payloads and parts.
 */
export class TokenBuilder {
  /**
   * Constructs a new TokenBuilder.
   *
   * @param {object} clock - Provides the current time in seconds.
   * @param {object} jtiGenerator - Generates unique JWT IDs.
   * @param {object} signatureManager - Manages JWT signing keys.
   */
  constructor (clock, jtiGenerator, signatureManager) {
    this.clock = clock
    this.jtiGenerator = jtiGenerator
    this.signatureManager = signatureManager
    this.base64Url = new Base64Url()
  }

  /**
   * Creates the JWT payload with issued-at, expiration, and unique token ID.
   *
   * @param {object} payload - The payload to include in the token.
   * @param {number} ttlSeconds - Time-to-live for the token in seconds.
   * @returns {object} The JWT payload object.
   */
  createJwtPayload (payload, ttlSeconds) {
    const iat = this.clock.getTimeInSeconds()
    return {
      ...payload,
      iat,
      exp: iat + ttlSeconds,
      jti: this.jtiGenerator.generateJti() // Unique token ID for revocation
    }
  }

  /**
   * Creates the JWT header and payload parts, encoding them in base64url format.
   *
   * @param {object} payload - The JWT payload objects.
   * @returns {object} An object containing the encoded header and payload.
   */
  createJwtParts (payload) {
    this.signatureManager.rotateIfNeeded()
    const header = { alg: 'RS256', typ: 'JWT', kid: this.signatureManager.getCurrentKeyId() }

    return {
      header: this.base64Url.encode(JSON.stringify(header)),
      payload: this.base64Url.encode(JSON.stringify(payload))
    }
  }
}
