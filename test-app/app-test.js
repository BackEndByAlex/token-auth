import { issueToken, decodeToken, verifyToken, revokeToken, rotateKey } from '../src/TokenService.js'

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
