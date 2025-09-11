/* TokenService.js
  * Service for creating and verifying JWT tokens.
  * (c) 2025, MIT license
  * @author Alexandru C.A
  * @description TokenService is responsible for managing JWT tokens, 
  * including creation, verification, and revocation.
*/

import keyManager from './KeyManager.js'
import revocationStore from './RevocationStore.js'
import clock from './Clock.js'
import base64Url from './Base64Url.js'

class TokenService {
  constructor() {
    this.keyManager = keyManager
    this.revocationStore = revocationStore
    this.clock = clock
    this.base64Url = base64Url
  }

  issueToken(payload, ttlSeconds) {
    return 'Not implemented yet'
  }

  verifyToken(token) {
    return 'Not implemented yet'
  }

  decodeToken(token) {
    return 'Not implemented yet'
  }

  revokeToken(jti, reason) {
    return 'Not implemented yet'
  }

  rotateKey() {
    return 'Not implemented yet'
  }
}


