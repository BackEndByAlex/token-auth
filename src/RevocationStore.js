/**
 * In-memory store for managing revoked tokens.
 *
 * Warning: Revoked tokens are stored in memory and will be lost on application restart.
 * For production use, consider a persistent storage solution (e.g., Redis, database).
 */
export class RevocationStore {
  constructor () {
    this.revokedTokens = new Set()
  }

  /**
   * Marks a token as revoked.
   *
   * @param {string} tokenId - The unique identifier of the token to revoke.
   * @param {string} reason - The reason for revocation (for logging purposes).
   * @throws {Error} If tokenId is not a valid string.
   */
  revokeToken (tokenId, reason) {
    this.#validateTokenId(tokenId)
    this.revokedTokens.add(tokenId)
    this.#logRevocation(tokenId, reason)
  }

  /**
   * Checks if a token with the given ID has been revoked.
   *
   * @param {string} tokenId - The ID of the token to check.
   * @returns {boolean} True if revoked, false otherwise.
   */
  isRevoked (tokenId) {
    if (!tokenId) {
      return false
    }

    return this.revokedTokens.has(tokenId)
  }

  /**
   * Returns the number of revoked tokens currently in the store.
   *
   * @returns {number} The count of revoked tokens.
   */
  getCount () {
    return this.revokedTokens.size
  }

  /**
   * Removes all revoked tokens from the store.
   */
  clear () {
    this.revokedTokens.clear()
  }

  // private methods

  #validateTokenId (tokenId) {
    if (!tokenId || typeof tokenId !== 'string') {
      throw new Error('Token ID must be a non-empty string')
    }
  }

  #logRevocation (tokenId, reason) {
    console.log(`Token ${tokenId} revoked. Reason: ${reason}`)
  }
}
