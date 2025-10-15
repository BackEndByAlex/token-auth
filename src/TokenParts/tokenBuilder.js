import { Base64Url } from '../base64Url.js'

/**
 * Builds JWT tokens by creating headers and payloads.
 */
export class TokenBuilder {
  static #JWT_ALGORITHM = 'RS256'
  static #JWT_TYPE = 'JWT'

  constructor (clock, tokenIdGenerator, signatureManager) {
    this.clock = clock
    this.tokenIdGenerator = tokenIdGenerator
    this.signatureManager = signatureManager
    this.base64Url = new Base64Url()
  }

  /**
   * Creates the JWT payload with issued-at, expiration, and unique token ID.
   *
   * @param {object} payload - User data to include.
   * @param {number} timeToLiveSeconds - Token lifetime in seconds.
   * @returns {object} Complete JWT payload with iat, exp, and jti.
   */
  createJwtPayload (payload, timeToLiveSeconds) {
    const iat = this.clock.now()
    return {
      ...payload,
      iat,
      exp: iat + timeToLiveSeconds,
      jti: this.tokenIdGenerator.generate()
    }
  }

  /**
   * Creates base64url-encoded JWT header and payload.
   *
   * @param {object} payload - The JWT payload objects.
   * @returns {object} An object containing the encoded header and payload.
   */
  createJwtParts (payload) {
    this.signatureManager.rotateIfNeeded()

    const header = {
      alg: TokenBuilder.#JWT_ALGORITHM,
      typ: TokenBuilder.#JWT_TYPE,
      kid: this.signatureManager.getCurrentKeyId()
    }

    return {
      header: this.base64Url.encode(JSON.stringify(header)),
      payload: this.base64Url.encode(JSON.stringify(payload))
    }
  }
}
