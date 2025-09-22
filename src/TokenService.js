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
import { SignatureManager } from './SignatureManager.js'

const base64Url = new Base64Url()
const clock = new Clock()
const signatureManager = new SignatureManager()
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
  signatureManager.rotateIfNeeded()
  const header = { alg: 'RS256', typ: 'JWT', kid: signatureManager.getCurrentKeyId() }
  const iat = clock.nowSeconds()
  const exp = iat + ttlSeconds

  const fullPayload = {
    ...payload,
    iat,
    exp,
    jti: jtiGenerator.generate() // Unique token ID for revocation
  }

  // Create JWT structure
  const headerEncoded = base64Url.encode(JSON.stringify(header))
  const payloadEncoded = base64Url.encode(JSON.stringify(fullPayload))
  const signature = signatureManager.sign(`${headerEncoded}.${payloadEncoded}`)

  return `${headerEncoded}.${payloadEncoded}.${signature}`
}

/**
 * Verifies a JWT token, checks its signature and revocation status.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {object} An object with 'valid' boolean and either 'payload' or 'error'.
 */
export function verifyToken (token) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid format' }
  }

  const [headerEncoded, payloadEncoded, signature] = parts
  const payload = JSON.parse(base64Url.decode(payloadEncoded))

  if (revocation.isRevoked(payload.jti)) {
    return { valid: false, error: 'Token revoked' }
  }

  const dataVerify = `${headerEncoded}.${payloadEncoded}`
  const header = JSON.parse(base64Url.decode(headerEncoded))
  const isValid = signatureManager.verify(dataVerify, signature, header.kid)

  return { valid: isValid, payload }
}

/**
 * Decodes a JWT token and returns its payload.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {object} The decoded payload.
 * @throws {Error} If the token format is invalid.
 */
export function decodeToken (token) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  const payloadEncoded = parts[1]
  const payload = JSON.parse(base64Url.decode(payloadEncoded))
  return payload
}

/**
 * Revokes a token by its jti (JWT ID).
 *
 * @param {string} jti - The unique identifier of the token to revoke.
 * @param {string} reason - The reason for revocation.
 * @returns {boolean} True if the token was revoked.
 */
export function revokeToken (jti, reason) {
  revocation.revokeToken(jti, reason)
  return true
}

/**
 * Rotates the signing key if needed.
 */
export function rotateKey () {
  signatureManager.rotateIfNeeded()
}
