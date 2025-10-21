# Test Report

## Test Method
The module is tested through an automated test application in test-app/app.js and test-app/functions-test.js that runs each function and verifies results.

Everything passes, the parts I test are those which are the most relevant for the system to work in my perspective.

### Components (Unit Tests)

| Component | What was tested | Result |
|-----------|-----------------|--------|
| Base64Url | Encoding/decoding | PASS |
| Clock | Timestamps | PASS |
| TokenIdGenerator | ID generation | PASS |
| SignatureManager | Signing/verification | PASS |
| RevocationStore | Token revocation | PASS |

### API Functions (Integration Tests)

| Function | What was tested | Result |
|----------|-----------------|--------|
| issueToken | Token creation | PASS |
| verifyToken| Token decoding | PASS |
| decodeToken | Token verification | PASS |
| revokeToken | Token revocation | PASS |
| rotateKey | Key rotation | PASS |
| refreshToken | Token refresh | PASS |