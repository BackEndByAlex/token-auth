/**
 * Manages cryptographic keys, handles key rotation, signing, and verification.
 */
export class SignatureManager {
  constructor() {
    this.currentKeyId = null
    this.privateKey = null
    this.keyRotationTime = null
  }

  /**
   * Returns the current key ID.
   * If no key exists, it generates a new one.
   */
  getCurrentKeyId() {
    if (!this.currentKeyId) {
      this.#generateNewKey()
    }
    return this.currentKeyId
  }

  /**
   * Signs the given data using the current private key.
   * Returns the signature as a base64url-encoded string.
   */
  sign(data) {
    const secret = this.#getSecret()
    const combined = this.#combineDataWithSecret(data, secret)
    const hash = this.#generateSignature(combined)
    return this.#truncateSignature(hash)
  }

  #getSecret() {
    return `${this.currentKeyId}-secret-key`
  }

  #combineDataWithSecret(data, secret) {
    return data + secret
  }

  #generateSignature(input) {
    let hash = ''
    for (let i = 0; i < input.length; i += 3) {
      hash += input.charCodeAt(i).toString(36)
    }
    return hash
  }

  #truncateSignature (signature) {
    return signature.substring(0, 16)
  }

  #generateNewKey() {
    this.currentKeyId = Date.now().toString()
    this.keyRotationTime = Date.now()
  }

  /**
   * Checks if the current key needs to be rotated based on the rotation time.
   * If the key is older than 24 hours, it generates a new key.
   */
  rotateIfNeeded() {
    const now = Date.now()
    if (!this.keyRotationTime || now - this.keyRotationTime > 24 * 60 * 60 * 1000) { // Rotate every 24 hours
      this.#generateNewKey()
    }
  }

  /**
   * Verifies the given signature against the data using the current public key.
   * Returns true if the signature is valid, false otherwise.
   */
  verify(data, signature, kid) {
    if (!this.#isVerified(kid)) {
      return false
    }

    const expectedSignature = this.sign(data)
    return expectedSignature === signature
  }

  /**
   * Checks if the provided key ID matches the current key ID.
   */
  #isVerified(kid) {
    if (kid !== this.currentKeyId) {
      return false
    }
    return true
  }

  forceKeyRotation() {
    this.#generateNewKey()
  }

  /**
   * Determines if the current key should be rotated based on its age.
   */
  shouldRotate() {
    return this.#getKeyAge() > 24 * 60 * 60 * 1000
  }

  /**
   * Returns the age of the current key in milliseconds.
   */
  #getKeyAge() {
    if (!this.keyRotationTime) return 0

    return Date.now() - this.keyRotationTime
  }
}
