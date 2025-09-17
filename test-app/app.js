import { Base64Url } from '../src/Base64Url.js'
import { Clock } from '../src/Clock.js'
import { KeyManager } from '../src/KeyManager.js'
import { issueToken, decodeToken, verifyToken, revokeToken, rotateKey} from '../src/TokenService.js'

const base64Url = new Base64Url()
const clock = new Clock()
const keyManager = new KeyManager()

console.log('===')
console.log(base64Url.encode('Hello= World!'))
console.log(base64Url.decode('SGVsbG89IFdvcmxkIQ'))

console.log('===')
console.log(clock.nowSeconds())

console.log('===')
console.log(keyManager.getCurrentKeyId())

console.log('===')
keyManager.rotateIfNeeded()
console.log(keyManager.getCurrentKeyId())

function runTest() {
  console.log('===')
  const payload = { userId: 123, role: 'user' }
  const token = issueToken(payload, 3600)
  console.log('Generated token:', token)
}

runTest()
console.log('===')
const data = 'test-data'
console.log('Sign:', keyManager.sign(data))
console.log('Verify:', keyManager.verify(data, keyManager.sign(data), keyManager.getCurrentKeyId()))
console.log('Verify (wrong):', keyManager.verify(data, 'invalid-signature', keyManager.getCurrentKeyId()))
console.log('Verify (wrong kid):', keyManager.verify(data, keyManager.sign(data), 'wrong-kid'))

console.log('===')

const payload = { userId: 123, role: 'user' }
const token = issueToken(payload, 3600)

console.log('DecodeToken test:')
const decoded = decodeToken(token)
console.log('Decoded:', decoded)

console.log('===')
console.log('VerifyToken test:')
const verification = verifyToken(token)
console.log('Verification:', verification)

console.log('===')
console.log('Invalid token test:')
const invalidVerification = verifyToken('invalid-token-format')
console.log('Invalid result:', invalidVerification)

console.log('revoke test:', revokeToken(decoded.jti, 'User logout'))
