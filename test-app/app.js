import { decode, encode } from '../src/Base64Url.js'
import { nowSeconds } from '../src/Clock.js'
import { rotateIfNeeded, getCurrentKeyId } from '../src/KeyManager.js'

console.log('===')
console.log(encode('Hello= World!'))
console.log(decode('SGVsbG89IFdvcmxkIQ'))

console.log('===')
console.log(nowSeconds())

console.log('===')
console.log(getCurrentKeyId())

console.log('===')
rotateIfNeeded()
console.log(getCurrentKeyId())
