// test-app/complete-test.js
import { Base64Url } from '../src/Base64Url.js'
import { Clock } from '../src/Clock.js'
import { SignatureManager } from '../src/SignatureManager.js'

console.log('='.repeat(50))

// Test 1: Base64Url Encoding/Decoding
console.log('\nTest 1: Base64Url Functions')
const base64Url = new Base64Url()
const testString = 'Hello= World!'
const encoded = base64Url.encode(testString)
const decoded = base64Url.decode('SGVsbG89IFdvcmxkIQ')
console.log(`Encode "${testString}": ${encoded}`)
console.log(`Decode back: ${decoded}`)
console.log(`Base64Url: ${decoded === testString ? 'PASS' : 'FAIL'}`)

// Test 2: Clock Functions
console.log('\nTest 2: Clock Functions')
const clock = new Clock()
const timestamp = clock.nowSeconds()
console.log(`Current timestamp: ${timestamp}`)
console.log(`Clock: ${timestamp > 0 ? 'PASS' : 'FAIL'}`)

// Test 3: KeyManager Functions
console.log('\nTest 3: KeyManager Functions')
const signatureManager = new SignatureManager()
const keyId1 = signatureManager.getCurrentKeyId()
signatureManager.rotateIfNeeded()
const keyId2 = signatureManager.getCurrentKeyId()
console.log(`Initial Key ID: ${keyId1}`)
console.log(`After rotation: ${keyId2}`)
console.log(`Key generation: ${keyId1 && keyId2 ? 'PASS' : 'FAIL'}`)

// Test 4: Signature Functions
console.log('\nTest 4: Digital Signature')
const testData = 'test-data'
const signature = signatureManager.sign(testData)
const validSignature = signatureManager.verify(testData, signature, signatureManager.getCurrentKeyId())
const invalidSignature = signatureManager.verify(testData, 'wrong-signature', signatureManager.getCurrentKeyId())
const wrongKeyId = signatureManager.verify(testData, signature, 'wrong-key-id')

console.log(`Data: "${testData}"`)
console.log(`Signature: ${signature}`)
console.log(`Valid signature: ${validSignature}`)
console.log(`Invalid signature: ${invalidSignature}`)
console.log(`Wrong key ID: ${wrongKeyId}`)
console.log(`Signature: ${validSignature && !invalidSignature && !wrongKeyId ? 'PASS' : 'FAIL'}`)
