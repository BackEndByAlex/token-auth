/**
 *
 * Service for creating and verifying JWT tokens.
 * (c) 2025, MIT license
 *
 * @author Alexandru C.A
 * @description TokenService is responsible for managing JWT tokens,
 * including creation, verification, and revocation.
 */

import { RevocationStore } from './revocationStore.js'
import { Clock } from './clock.js'
import { JtiGenerator } from './generateJti.js'
import { SignatureManager } from './signatureManager.js'
import { TokenBuilder } from './TokenParts/TokenParts.js'
import { TokenParser } from './TokenParts/TokenParser.js'
import { TokenValidator } from './TokenParts/TokenValidator.js'

const clock = new Clock()
const jtiGenerator = new JtiGenerator()
const signatureManager = new SignatureManager()
const revocation = new RevocationStore()
const tokenBuilder = new TokenBuilder(clock, jtiGenerator, signatureManager)
const tokenParser = new TokenParser()
const tokenValidator = new TokenValidator(revocation, signatureManager)

/**
 * Issues a JWT token with the given payload and time-to-live.
 *
 * @param {object} payload - The payload to include in the token.
 * @param {number} ttlSeconds - Time-to-live for the token in seconds.
 * @returns {string} The signed JWT token.
 */
export function issueToken (payload, ttlSeconds) {
  const jwtPayload = tokenBuilder.createJwtPayload(payload, ttlSeconds)
  const jwtParts = tokenBuilder.createJwtParts(jwtPayload)
  return signJwt(jwtParts)
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
    const parts = tokenParser.parseTokenParts(token)
    const decoded = tokenParser.decodeTokenParts(parts)
    return tokenValidator.validateTokenParts(parts, decoded)
  } catch (error) {
    return { valid: false, error: 'Verification failed' }
  }
}

/**
 * Decodes a JWT token and returns its payload.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {object} The decoded payload.
 * @throws {Error} If the token format is invalid.
 */
export function decodeToken (token) {
  try {
    const parts = tokenParser.parseTokenParts(token)
    const decoded = tokenParser.decodeTokenParts(parts)
    return decoded.payload
  } catch (error) {
    throw new Error('Invalid token format')
  }
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
  signatureManager.forceKeyRotation()
}

/**
 * Refreshes a JWT token by verifying the old token and issuing a new one with a new TTL.
 *
 * @param {string} oldToken - The old JWT token to refresh.
 * @param {number} newTtl - The new time-to-live for the refreshed token in seconds.
 * @returns {object} An object containing the new token and the old token's expiry.
 */
export function refreshToken (oldToken, newTtl) {
  const verifiedToken = verifyToken(oldToken)
  tokenValidator.validateTokenForRefresh(verifiedToken)

  const userPayload = extractUserPayload(verifiedToken.payload)
  const newToken = issueToken(userPayload, newTtl)

  return {
    token: newToken,
    oldTokenExpiry: verifiedToken.payload.exp
  }
}

/**
 * Extracts the user payload from a JWT payload by removing standard JWT claims.
 *
 * @param {object} payload - The full JWT payload.
 * @returns {object} The user-specific payload without iat, exp, and jti.
 */
function extractUserPayload (payload) {
  // Remove JWT standard claims - they will be regenerated for the new token
  const { iat, exp, jti, ...userPayload } = payload
  return userPayload
}
