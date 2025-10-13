/**
 * Unit tests for individual components
 * Tests each class and its methods in isolation
 */

import { Base64Url } from '../src/base64Url.js'
import { Clock } from '../src/clock.js'
import { TokenIdGenerator } from '../src/tokenIdGenerator.js'
import { SignatureManager } from '../src/signatureManager.js'
import { RevocationStore } from '../src/revocationStore.js'

let passed = 0
let failed = 0

function test(description, condition) {
  if (condition) {
    console.log(`✓ ${description}`)
    passed++
  } else {
    console.log(`✗ ${description}`)
    failed++
  }
}

function section(title) {
  console.log('\n' + '-'.repeat(60))
  console.log(title)
  console.log('-'.repeat(60))
}

// Base64Url Tests
section('Base64Url Encoder/Decoder')

const encoder = new Base64Url()

const testString = 'Hello World!'
const encoded = encoder.encode(testString)
test('Encodes string correctly', encoded === 'SGVsbG8gV29ybGQh')

const decoded = encoder.decode(encoded)
test('Decodes back to original string', decoded === testString)

const urlSafeString = 'test+/='
const urlSafeEncoded = encoder.encode(urlSafeString)
test('Encoded string is URL-safe (no +, /, =)', 
  !urlSafeEncoded.includes('+') && 
  !urlSafeEncoded.includes('/') && 
  !urlSafeEncoded.includes('=')
)

let encodeError = null
try {
  encoder.decode('invalid@chars!')
} catch (error) {
  encodeError = error
}
test('Throws error on invalid base64url characters', encodeError !== null)

// Clock Tests
section('Clock Time Provider')

const clock = new Clock()
const timestamp1 = clock.now()

test('Returns numeric timestamp', typeof timestamp1 === 'number')
test('Timestamp is positive', timestamp1 > 0)
test('Timestamp is in seconds (not milliseconds)', timestamp1 < Date.now())

// Small delay to test time progression
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
await wait(10)

const timestamp2 = clock.now()
test('Time progresses forward', timestamp2 >= timestamp1)

// TokenIdGenerator Tests
section('Token ID Generator')

const idGenerator = new TokenIdGenerator()
const id1 = idGenerator.generate()

test('Generates non-empty ID', id1.length > 0)
test('ID contains timestamp portion', id1.length > 13)

const id2 = idGenerator.generate()
test('Generates unique IDs', id1 !== id2)

test('ID format is alphanumeric', /^[a-z0-9]+$/.test(id1))

// SignatureManager Tests
section('Signature Manager')

const sigManager = new SignatureManager()
const keyId1 = sigManager.getCurrentKeyId()

test('Generates key ID on first access', keyId1 !== null)
test('Key ID is a string', typeof keyId1 === 'string')

const data = 'test-data-to-sign'
const signature = sigManager.sign(data)

test('Creates signature', signature !== null && signature.length > 0)
test('Signature has expected length', signature.length === 16)

const isValid = sigManager.verify(data, signature, keyId1)
test('Valid signature passes verification', isValid === true)

const invalidSig = sigManager.verify(data, 'wrong-signature', keyId1)
test('Invalid signature fails verification', invalidSig === false)

const wrongKey = sigManager.verify(data, signature, 'wrong-key-id')
test('Wrong key ID fails verification', wrongKey === false)

sigManager.forceKeyRotation()
const keyId2 = sigManager.getCurrentKeyId()
test('Key rotation creates new key ID', keyId1 !== keyId2)

const shouldRotate = sigManager.shouldRotate()
test('Newly rotated key should not need rotation', shouldRotate === false)

// RevocationStore Tests
section('Revocation Store')

const store = new RevocationStore()

test('New store has zero revoked tokens', store.getCount() === 0)

const tokenId = 'test-token-id-123'
store.revokeToken(tokenId, 'Test revocation')

test('Store count increases after revocation', store.getCount() === 1)
test('Revoked token is marked as revoked', store.isRevoked(tokenId) === true)
test('Non-revoked token is not marked', store.isRevoked('other-id') === false)

store.revokeToken('second-token', 'Another test')
test('Can revoke multiple tokens', store.getCount() === 2)

store.clear()
test('Clear removes all revoked tokens', store.getCount() === 0)
test('Cleared token is no longer revoked', store.isRevoked(tokenId) === false)

let validationError = null
try {
  store.revokeToken('', 'Invalid')
} catch (error) {
  validationError = error
}
test('Empty token ID throws error', validationError !== null)

test('Handles null token ID gracefully', store.isRevoked(null) === false)

console.log(`Tests passed: ${passed}`)
console.log(`Tests failed: ${failed}`)