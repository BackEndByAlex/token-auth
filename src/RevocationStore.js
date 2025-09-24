/**
 * A store for managing revoked tokens.
 */
export class RevocationStore {
  /**
   * Initializes a new instance of the RevocationStore.
   */
  constructor () {
    this.revokedTokens = new Set()
  }

  /**
   * Revokes a token by its unique identifier (jti).
   *
   * @param {string} jti - The unique identifier of the token to revoke.
   * @param {string} reason - The reason for revoking the token.
   */
  revokeToken (jti, reason) {
    this.revokedTokens.add(jti)
    console.log(`Revoking token ${jti} for reason: ${reason}`)
  }

  /**
   * Checks if a token with the given unique identifier (jti) has been revoked.
   *
   * @param {string} jti - The unique identifier of the token to check.
   * @returns {boolean} True if the token is revoked, false otherwise.
   */
  checkIfRevoked (jti) {
    return this.revokedTokens.has(jti)
  }
}
