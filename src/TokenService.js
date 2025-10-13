/**
 * Service for creating and verifying JWT tokens.
 * 
 * Educational purpose only. Not for production use.
 * 
 * @author Alexandru C.A
 * @license MIT
 */

import { RevocationStore } from './revocationStore.js'
import { Clock } from './clock.js'
import { TokenIdGenerator  } from './tokenIdGenerator.js'
import { SignatureManager } from './signatureManager.js'
import { TokenBuilder } from './TokenParts/tokenBuilder.js'
import { TokenParser } from './TokenParts/tokenParser.js'
import { TokenValidator } from './TokenParts/tokenValidator.js'

const clock = new Clock()
const tokenIdGenerator = new TokenIdGenerator()
const signatureManager = new SignatureManager()
const revocationStore = new RevocationStore()
const tokenBuilder = new TokenBuilder(clock, tokenIdGenerator, signatureManager)
const tokenParser = new TokenParser()
const tokenValidator = new TokenValidator(revocationStore, signatureManager)

/**
 * Issues a new JWT token.
 *
 * @param {object} payload - The payload to include in the token.
 * @param {number} ttlSeconds - Time-to-live for the token in seconds.
 * @returns {string} The signed JWT token.
 */
export function issueToken (payload, ttlSeconds) {
  const jwtPayload = tokenBuilder.createJwtPayload(payload, ttlSeconds)
  const jwtParts = tokenBuilder.createJwtParts(jwtPayload)
  return signToken(jwtParts)
}

/**
 * Verifies a JWT token's validity.
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
 * Decodes a JWT token without verification.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {object} The decoded payload.
 * @throws {Error} If the token format is invalid.
 */
export function decodeToken (token) {
    const parts = tokenParser.parseTokenParts(token)
    const decoded = tokenParser.decodeTokenParts(parts)
    return decoded.payload
}

/**
 * Revokes a token by its identifier.
 *
 * @param {string} tokenId - The unique identifier of the token to revoke.
 * @param {string} reason - The reason for revocation.
 */
export function revokeToken (tokenId, reason) {
  revocationStore.revokeToken(tokenId, reason)
}

/**
 * Forces rotation of the signing key.
 */
export function rotateKey () {
  signatureManager.forceKeyRotation()
}

/**
 * Refreshes an existing token with a new expiration time.
 *
 * @param {string} oldToken - The token to refresh.
 * @param {number} newTimeToLive - New expiration time in seconds.
 * @returns {object} Object with new token and old token's expiry.
 */
export function refreshToken (oldToken, newTimeToLive) {
  const verifiedToken = verifyToken(oldToken)
  tokenValidator.validateTokenForRefresh(verifiedToken)

  const userPayload = extractUserPayload(verifiedToken.payload)
  const newToken = issueToken(userPayload, newTimeToLive)

  return {
    token: newToken,
    oldTokenExpiry: verifiedToken.payload.exp
  }
}

// helper function

function signToken ({ header, payload }) {
  const signature = signatureManager.sign(`${header}.${payload}`)
  return `${header}.${payload}.${signature}`
}

function extractUserPayload (payload) {
  const { iat, exp, jti, ...userPayload } = payload
  return userPayload
}