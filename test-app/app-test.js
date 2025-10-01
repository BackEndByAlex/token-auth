import { issueToken, decodeToken, verifyToken, revokeToken, rotateKey, refreshToken } from '../src/TokenService.js'

console.log('='.repeat(50))

// Test 1: Token Creation and Decoding
console.log('\nTest 1: Token Creation & Decoding')
const payload = { userId: 123, role: 'admin', name: 'Alexandru' }
const token = issueToken(payload, 3600)
const decodedPayload = decodeToken(token)

console.log('Original payload:', payload)
console.log('Token (first 60 chars):', token.substring(0, 60) + '...')
console.log('Decoded payload:', decodedPayload)
console.log(`Token creation: ${decodedPayload.userId === 123 ? 'PASS' : 'FAIL'}`)

// Test 2: Token Verification
console.log('\nTest 2: Token Verification')
const validCheck = verifyToken(token)
console.log('Valid token check:', validCheck)
console.log(`Token verification: ${validCheck.valid ? 'PASS' : 'FAIL'}`)

// Test 3: Token Rotation
console.log('\nTest 3: Token Rotation')
const oldHeader = JSON.parse(atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')))
console.log('Original Key ID:', oldHeader.kid)

rotateKey()

// Skapa ny token
const newToken = issueToken(payload, 3600)
const newHeader = JSON.parse(atob(newToken.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')))
console.log('New Key ID:', newHeader.kid)
console.log('Key changed:', oldHeader.kid !== newHeader.kid ? 'YES' : 'NO')

const postRotateCheck = verifyToken(token)
console.log('Post-rotation token check:', postRotateCheck)
console.log(`Token validity after rotation: ${postRotateCheck.valid ? 'FAIL (correct)' : 'PASS'}`)

// Test 4: Token Revocation
console.log('\nTest 4: Token Revocation')
const jtiToRevoke = decodedPayload.jti
const revokeResult = revokeToken(jtiToRevoke, 'User logged out')
const postRevokeCheck = verifyToken(token)
console.log(`Revocation result: ${revokeResult ? 'Success' : 'Failure'}`)
console.log('Post-revocation token check:', postRevokeCheck)
console.log(`Token revocation: ${!postRevokeCheck.valid ? 'PASS' : 'FAIL'}`)
console.log('='.repeat(50))

// Test 5: Token Refresh
console.log('\nTest 5: Token Refresh')
const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.invalid-signature'
try {
  refreshToken(fakeToken, 3600)
  console.log('Invalid token refresh: FAIL (should not work)')
} catch (error) {
  console.log('Invalid token refresh blocked:', error.message)
  console.log('Invalid token refresh: PASS')
}

console.log('='.repeat(50))

// Test 6: Revoked Token Refresh
console.log('\nTest 6: Revoked Token Refresh')
const tokenToRevoke = issueToken({ userId: 300 }, 3600)
const decodedRevoke = decodeToken(tokenToRevoke)
revokeToken(decodedRevoke.jti, 'Test revocation')

console.log('='.repeat(50))
