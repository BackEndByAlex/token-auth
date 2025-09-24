/**
 *
 * Service for creating and verifying JWT tokens.
 * (c) 2025, MIT license
 *
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
 * Issues a JWT token with the given payload and time-to-live.
 *
 * @param {object} payload - The payload to include in the token.
 * @param {number} ttlSeconds - Time-to-live for the token in seconds.
 * @returns {string} The signed JWT token.
 */
export function issueToken (payload, ttlSeconds) {
  const jwtPayload = createJwtPayload(payload, ttlSeconds)
  const jwtParts = createJwtParts(jwtPayload)
  return signJwt(jwtParts)
}

/**
 * Creates the JWT payload with issued-at, expiration, and unique token ID.
 *
 * @param {object} payload - The payload to include in the token.
 * @param {number} ttlSeconds - Time-to-live for the token in seconds.
 * @returns {object} The JWT payload object.
 */
function createJwtPayload (payload, ttlSeconds) {
  const iat = clock.nowSeconds()
  return {
    ...payload,
    iat,
    exp: iat + ttlSeconds,
    jti: jtiGenerator.generate() // Unique token ID for revocation
  }
}

/**
 * Creates the JWT header and payload parts, encoding them in base64url format.
 *
 * @param {object} payload - The JWT payload object.
 * @returns {object} An object containing the encoded header and payload.
 */
function createJwtParts (payload) {
  signatureManager.rotateIfNeeded()
  const header = { alg: 'RS256', typ: 'JWT', kid: signatureManager.getCurrentKeyId() }

  return {
    header: base64Url.encode(JSON.stringify(header)),
    payload: base64Url.encode(JSON.stringify(payload))
  }
}

/**
 * Signs the JWT header and payload using the current signature key.
 *
 * @param {object} param0 - An object containing the encoded header and payload.
 * @param {string} param0.header - The base64url encoded JWT header.
 * @param {string} param0.payload - The base64url encoded JWT payload.
 * @returns {string} The signed JWT token.
 */
function signJwt ({ header, payload }) {
  const signature = signatureManager.sign(`${header}.${payload}`)
  return `${header}.${payload}.${signature}`
}

/**
 * Verifies a JWT token, checking its signature and revocation status.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {object} An object with 'valid' boolean and either 'payload' or 'error'.
 */
export function verifyToken (token) {
  try {
    const parts = parseTokenParts(token)
    const decoded = decodeTokenParts(parts)
    return validateTokenParts(parts, decoded)
  } catch (error) {
    return { valid: false, error: 'Verification failed' }
  }
}

/**
 * Splits a JWT token into its component parts.
 *
 * @param {string} token - The JWT token to split.
 * @returns {string[]} An array containing the header, payload, and signature.
 * @throws {Error} If the token format is invalid.
 */
function parseTokenParts (token) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }
  return parts
}

/**
 * Decodes the header and payload parts of a JWT token.
 *
 * @param {string[]} parts - Array containing the encoded header, payload, and signature.
 * @returns {object} An object with decoded header, payload, and their encoded forms.
 */
function decodeTokenParts (parts) {
  const [headerEncoded, payloadEncoded] = parts
  return {
    header: JSON.parse(base64Url.decode(headerEncoded)),
    payload: JSON.parse(base64Url.decode(payloadEncoded)),
    headerEncoded,
    payloadEncoded
  }
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
function validateTokenParts (parts, { header, payload, headerEncoded, payloadEncoded }) {
  if (revocation.checkIfRevoked(payload.jti)) {
    return { valid: false, error: 'Token revoked' }
  }

  const dataVerify = `${headerEncoded}.${payloadEncoded}`
  const isValid = signatureManager.verify(dataVerify, parts[2], header.kid)

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
