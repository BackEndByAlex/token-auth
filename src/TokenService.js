/* TokenService.js
  * Service for creating and verifying JWT tokens.
  * (c) 2025, MIT license
  * @author Alexandru C.A
  * @description TokenService is responsible for managing JWT tokens,
  * including creation, verification, and revocation.
*/

import { RevocationStore } from './RevocationStore.js'
import { Base64Url } from './Base64Url.js'
import { Clock } from './Clock.js'
import { JtiGenerator } from './generateJti.js'
import { KeyManager } from './KeyManager.js'

const base64Url = new Base64Url()
const clock = new Clock()
const keyManager = new KeyManager()
const jtiGenerator = new JtiGenerator()
const revocation = new RevocationStore()

/**
 * Generates a unique token identifier (jti).
 * This is done using random values.
 * Returns a string representation of the jti.
 *
 * @param {object} payload - The payload to include in the token.
 * @param {number} ttlSeconds - Time-to-live for the token in seconds.
 * @returns {string} The signed JWT token.
 */
export function issueToken (payload, ttlSeconds) {
  keyManager.rotateIfNeeded()
  const header = { alg: 'RS256', typ: 'JWT', kid: keyManager.getCurrentKeyId() }
  const iat = clock.nowSeconds()
  const exp = iat + ttlSeconds

  const fullPayload = {
    ...payload,
    iat,
    exp,
    jti: jtiGenerator.generateJti() // Unique token ID for revocation
  }

  // Create JWT structure
  const headerEncoded = base64Url.encode(JSON.stringify(header))
  const payloadEncoded = base64Url.encode(JSON.stringify(fullPayload))
  const signature = keyManager.sign(`${headerEncoded}.${payloadEncoded}`)

  return `${headerEncoded}.${payloadEncoded}.${signature}`
}

export function verifyToken(token) {

}

export function decodeToken(token) {

}

export function revokeToken(jti, reason) {

}

export function rotateKey() {

}
