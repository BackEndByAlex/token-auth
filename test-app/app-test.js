/**
 * Integration tests for TokenService public API
 * Tests the main functionality exposed to users of the module
 */

import { issueToken, decodeToken, verifyToken, revokeToken, rotateKey, refreshToken } from '../src/tokenService.js'

let testsPassed = 0
let testsFailed = 0

function printTestResult(testName, condition, details = '') {
  if (condition) {
    console.log(`✓ ${testName}`)
    testsPassed++
  } else {
    console.log(`✗ ${testName}`)
    if (details) console.log(`  ${details}`)
    testsFailed++
  }
}

function printSection(title) {
  console.log('\n' + '-'.repeat(60))
  console.log(title)
  console.log('-'.repeat(60))
}

// Test 1: Token Creation and Decoding
printSection('Test 1: Token Lifecycle - Create & Decode')

const userPayload = { userId: 123, role: 'admin', email: 'test@example.com' }
const token = issueToken(userPayload, 3600)
const decoded = decodeToken(token)

printTestResult(
  'Token is created and has correct format',
  token && token.split('.').length === 3
)

printTestResult(
  'Decoded payload contains original data',
  decoded.userId === 123 && decoded.role === 'admin'
)

printTestResult(
  'Token includes standard JWT claims (iat, exp, jti)',
  decoded.iat && decoded.exp && decoded.jti
)

printTestResult(
  'Token expiration is set correctly',
  decoded.exp === decoded.iat + 3600
)

// Test 2: Token Verification
printSection('Test 2: Token Verification')

const verification = verifyToken(token)

printTestResult(
  'Valid token passes verification',
  verification.valid === true
)

printTestResult(
  'Verification returns payload on success',
  verification.payload && verification.payload.userId === 123
)

const invalidToken = 'invalid.token.here'
const invalidVerification = verifyToken(invalidToken)

printTestResult(
  'Invalid token fails verification',
  invalidVerification.valid === false
)

printTestResult(
  'Failed verification includes error message',
  invalidVerification.error !== undefined
)

// Test 3: Key Rotation
printSection('Test 3: Key Rotation')

const tokenBeforeRotation = issueToken({ userId: 999 }, 3600)
rotateKey()
const tokenAfterRotation = issueToken({ userId: 999 }, 3600)

const headerBefore = JSON.parse(atob(tokenBeforeRotation.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')))
const headerAfter = JSON.parse(atob(tokenAfterRotation.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')))

printTestResult(
  'Key rotation changes the key ID',
  headerBefore.kid !== headerAfter.kid
)

const oldTokenVerification = verifyToken(tokenBeforeRotation)

printTestResult(
  'Tokens signed with old key become invalid after rotation',
  oldTokenVerification.valid === false
)

// Test 4: Token Revocation
printSection('Test 4: Token Revocation')

const tokenToRevoke = issueToken({ userId: 456 }, 3600)
const decodedToRevoke = decodeToken(tokenToRevoke)

const verificationBeforeRevoke = verifyToken(tokenToRevoke)
printTestResult(
  'Token is valid before revocation',
  verificationBeforeRevoke.valid === true
)

revokeToken(decodedToRevoke.jti, 'User logged out')

const verificationAfterRevoke = verifyToken(tokenToRevoke)
printTestResult(
  'Token becomes invalid after revocation',
  verificationAfterRevoke.valid === false
)

printTestResult(
  'Revoked token returns appropriate error',
  verificationAfterRevoke.error === 'Token revoked'
)

// Test 5: Token Refresh
printSection('Test 5: Token Refresh')

const freshToken = issueToken({ userId: 789, role: 'user' }, 3600)
const refreshResult = refreshToken(freshToken, 7200)

printTestResult(
  'Refresh returns new token',
  refreshResult.token !== undefined && refreshResult.token !== freshToken
)

printTestResult(
  'Refresh returns old token expiry',
  refreshResult.oldTokenExpiry !== undefined
)

const newDecoded = decodeToken(refreshResult.token)
printTestResult(
  'Refreshed token has new expiration time',
  newDecoded.exp === newDecoded.iat + 7200
)

printTestResult(
  'Refreshed token preserves user data',
  newDecoded.userId === 789 && newDecoded.role === 'user'
)

// Test invalid token refresh
let refreshError = null
try {
  refreshToken('invalid.token.format', 3600)
} catch (error) {
  refreshError = error
}

printTestResult(
  'Refreshing invalid token throws error',
  refreshError !== null
)

console.log(`Tests passed: ${testsPassed}`)
console.log(`Tests failed: ${testsFailed}`)