# Test Report

## Test Method
The module is tested through an automated test application in test-app/app.js and functions.js that runs each function and verifies results.

## Test Results

| What was tested                  | How it was tested               | Test result | Buggs |
|-----------------                 |-------------------              |-------------|-------|
| Base64Url encoding/decoding      | Encoded and decoded test string |    PASS     |       |
| Token creation (issueToken)      | Created token with payload      |    PASS     |       |
| Token verification (verifyToken) | Verified valid token            |    PASS     |       |
| Token decoding (decodeToken)     | Extracted payload from token    |    PASS     |       |
| Token revocation (revokeToken)   | Revoked token and verified      |    PASS     |       |
| Key rotation (rotateToken)       | Rotated key, old token invalid  |    PASS     | force rotate key it's working, 24h rotate key I did not test |
| Invalid token handling           | Tested with malformed token     |    PASS     |
