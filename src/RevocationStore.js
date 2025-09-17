export class RevocationStore {
  constructor () {
    this.revokedTokens = new Set()
  }

  revokeToken (jti, reason) {
    this.revokedTokens.add(jti)
    console.log(`Revoking token ${jti} for reason: ${reason}`)
  }

  isRevoked (jti) {
    return this.revokedTokens.has(jti)
  }
}
