/* TokenService.js
  * Service for creating and verifying JWT tokens.
  * (c) 2025, MIT license
  * @author Alexandru C.A
  * @description TokenService is responsible for managing JWT tokens, 
  * including creation, verification, and revocation.
*/

import { keyManager } from './KeyManager.js'
import { revocationStore } from './RevocationStore.js'
import { clock } from './Clock.js'
import { encode, decode } from './Base64Url.js'

class TokenService {
  constructor() {
    this.keyManager = keyManager
    this.revocationStore = revocationStore
    this.clock = clock
    this.base64Url = base64Url
  }
  /*
    * Generates a unique token identifier (jti).
    * This is done using random values.
    * Returns a string representation of the jti.
  */
  issueToken(payload, ttlSeconds) {
    this.keyManager.rotateIfNeeded()
    const header = { alg: 'RS256', typ: 'JWT', kid: this.keyManager.getCurrentKeyId() }
    const iat = this.clock.nowSeconds()
    const exp = iat + ttlSeconds

    const fullPayload = {
      ...payload,
      iat,
      exp,
      jti: this.generateJti() // Unique token ID for revocation
    }

    // Create JWT structure
    const headerEncoded = encode(JSON.stringify(header))
    const payloadEncoded = encode(JSON.stringify(fullPayload))
    const signature = this.keyManager.sign(`${headerEncoded}.${payloadEncoded}`)

    return `${headerEncoded}.${payloadEncoded}.${signature}`
  }

  verifyToken(token) {
  }

  decodeToken(token) {
  }

  revokeToken(jti, reason) {
  }

  rotateKey() {
  }

  #generateJti() {
    
  }
}


