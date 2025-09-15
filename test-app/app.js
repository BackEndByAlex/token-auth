import { decode, encode } from '../src/Base64Url.js'

console.log(encode('Hello= World!'))
console.log(decode('SGVsbG89IFdvcmxkIQ'))
