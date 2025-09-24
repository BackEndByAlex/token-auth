# Token-Auth Module

A lightweight, dependency-free JavaScript module for issuing, verifying, and revoking JWT-style authentication tokens. Designed for educational purposes and small-scale applications requiring basic token-based authentication with key rotation, expiration handling, and revocation capabilities.

## Features

- **Token Creation**: Generate signed tokens with custom payloads and expiration times
- **Token Verification**: Validate token signatures and check revocation status
- **Token Revocation**: Maintain a revocation list for invalidated tokens
- **Key Rotation**: Automatic key rotation with configurable intervals
- **Base64URL Encoding**: RFC 4648 compliant encoding/decoding
- **Zero Dependencies**: No external libraries required

## Installation

### From GitHub
```bash
git clone https://github.com/your-username/token-auth.git
cd token-auth
```

### As ES6 Module
```javascript
import { issueToken, verifyToken, decodeToken, revokeToken } from './src/TokenService.js'
```

## Usage Examples

### Basic Token Operations

```javascript
import { issueToken, verifyToken, decodeToken, revokeToken } from './src/TokenService.js'

// Create a token
const payload = { 
  userId: 123, 
  role: 'admin', 
  permissions: ['read', 'write'] 
}
const token = issueToken(payload, 3600) // 1 hour expiration
console.log('Token:', token)

// Verify a token
const verification = verifyToken(token)
if (verification.valid) {
  console.log('Token is valid:', verification.payload)
} else {
  console.log('Token invalid:', verification.error)
}

// Decode token payload (without verification)
const decodedPayload = decodeToken(token)
console.log('Decoded payload:', decodedPayload)

// Revoke a token
const success = revokeToken(decodedPayload.jti, 'User logged out')
console.log('Revocation successful:', success)
```

### Authentication Middleware Example

```javascript
function authenticateRequest(token) {
  const result = verifyToken(token)
  
  if (!result.valid) {
    throw new Error(`Authentication failed: ${result.error}`)
  }
  
  // Check if token is expired
  if (result.payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token has expired')
  }
  
  return result.payload
}

// Usage
try {
  const userInfo = authenticateRequest(userToken)
  console.log(`Authenticated user: ${userInfo.userId}`)
} catch (error) {
  console.error('Authentication error:', error.message)
}
```

### Session Management Example

```javascript
class SessionManager {
  constructor() {
    this.activeSessions = new Map()
  }
  
  login(userId, userData) {
    const payload = { userId, ...userData }
    const token = issueToken(payload, 24 * 60 * 60) // 24 hours
    const decoded = decodeToken(token)
    
    this.activeSessions.set(userId, decoded.jti)
    return token
  }
  
  logout(userId) {
    const jti = this.activeSessions.get(userId)
    if (jti) {
      revokeToken(jti, 'User logout')
      this.activeSessions.delete(userId)
      return true
    }
    return false
  }
  
  validateSession(token) {
    const result = verifyToken(token)
    if (result.valid) {
      return result.payload
    }
    return null
  }
}
```

## API Reference

### `issueToken(payload, ttlSeconds)`
Creates a new JWT token with the specified payload and expiration time.

**Parameters:**
- `payload` (Object): Data to include in the token
- `ttlSeconds` (Number): Time-to-live in seconds

**Returns:** String - The signed JWT token

**Example:**
```javascript
const token = issueToken({ userId: 123, role: 'user' }, 3600)
```

### `verifyToken(token)`
Verifies a token's signature and checks if it has been revoked.

**Parameters:**
- `token` (String): The JWT token to verify

**Returns:** Object with properties:
- `valid` (Boolean): Whether the token is valid
- `payload` (Object): Token payload if valid
- `error` (String): Error message if invalid

**Example:**
```javascript
const result = verifyToken(token)
if (result.valid) {
  console.log('User ID:', result.payload.userId)
}
```

### `decodeToken(token)`
Decodes a token's payload without verification.

**Parameters:**
- `token` (String): The JWT token to decode

**Returns:** Object - The decoded payload

**Example:**
```javascript
const payload = decodeToken(token)
console.log('Token expires at:', new Date(payload.exp * 1000))
```

### `revokeToken(jti, reason)`
Adds a token to the revocation list.

**Parameters:**
- `jti` (String): The token's unique identifier
- `reason` (String): Reason for revocation

**Returns:** Boolean - Always returns true

**Example:**
```javascript
const payload = decodeToken(token)
revokeToken(payload.jti, 'Security breach')
```

### `rotateKey()`
Manually triggers key rotation.

**Example:**
```javascript
rotateKey() // Forces generation of new signing key
```

## Token Structure

Tokens follow JWT format with three base64url-encoded sections:

```
header.payload.signature
```

### Header
```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "1609459200000"
}
```

### Payload
```json
{
  "userId": 123,
  "role": "admin",
  "iat": 1609459200,
  "exp": 1609462800,
  "jti": "16094592000001a2b3c4"
}
```

## Security Considerations

⚠️ **Educational Use Only**: This implementation uses simplified cryptography and is intended for learning purposes. For production applications, use established libraries like `jsonwebtoken` or `jose`.

### Key Limitations
- Uses basic hash-based signatures instead of RSA/ECDSA
- No key persistence across application restarts
- In-memory revocation store (not persistent)
- No token refresh mechanism
- No rate limiting or brute force protection

### Best Practices When Using
- Use HTTPS in production environments
- Implement short token expiration times
- Store tokens securely (httpOnly cookies recommended)
- Implement proper session management
- Use environment variables for sensitive configuration
- Implement token refresh workflows for long-lived sessions

## Development

### Running Tests
```bash
node test-app/app-test.js
node test-app/functions-test.js
```

## Contributing

This is an educational project. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Technical References

### JWT Standards
- [RFC 7519 - JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519)
- [Auth0 JWT Claims Documentation](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims)

### Security Best Practices
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [OWASP Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### Encoding Standards
- [RFC 4648 - Base64url Encoding](https://www.rfc-editor.org/rfc/rfc4648#section-5)
- [MDN btoa Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa)

### Implementation References
- [jose - JavaScript JWT library](https://github.com/panva/jose)
- [jsonwebtoken - Node.js JWT library](https://github.com/auth0/node-jsonwebtoken)

## Version History

- **v1.0.0** - Initial release with basic token operations
- Features: Token creation, verification, revocation, key rotation