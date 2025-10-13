/**
 * Manages cryptographic keys, handles key rotation, signing, and verification.
 */
export class SignatureManager {
  static ROTATION_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours
  static SIGNATURE_LENGTH = 16 // Length of the truncated signature

  /**
   * Initializes a new instance of the SignatureManager class.
   */
  constructor() {
    this.currentKeyId = null
    this.keyRotationTime = null
  }

  /**
   * Returns the current key ID.
   * If no key exists, it generates a new one.
   *
   * @returns {string} The current key ID.
   */
  getCurrentKeyId() {
    if (!this.currentKeyId) {
      this.#generateNewKey()
    }
    return this.currentKeyId
  }

  /**
   * Createa a cryptographic signature for the given data.
   * 
   * Note one thing: This is a simplified example and does not use real cryptographic methods.
   * It's use for educational purposes only.
   *
   * @param {string} data - The data to sign.
   * @returns {string} The signature string.
   */
  sign(data) {
    const secret = this.#getSecret()
    const combined = this.#combineDataWithSecret(data, secret)
    const hash = this.#generateSignature(combined)
    return this.#truncateSignature(hash)
  }

  /**
   * Verifies a signature against the original data.
   *
   * @param {string} data - The original data that was signed.
   * @param {string} signature - The signature to verify.
   * @param {string} keyId - The key ID used for signing.
   * @returns {boolean} True if signature is valid, false otherwise.
   */
  verify(data, signature, keyId) {
    if (!this.#isKeyIdValid(keyId)) {
      return false
    }

    const expectedSignature = this.sign(data)
    return expectedSignature === signature
  }

  /**
   * Rotates the signing key if it has expired.
   */
  rotateIfNeeded () {
    const now = Date.now()
    if (!this.keyRotationTime || now - this.keyRotationTime > ROTATION_INTERVAL_MS) { // Rotate every 24 hours
      this.#generateNewKey()
    }
  }

  /**
   * Forces key rotation.
   */
  forceKeyRotation () {
    this.#generateNewKey()
  }
  
  /**
   * Determines if the current key should be rotated based on its age.
   * 
   * @returns {boolean} True if the key should be rotated, false otherwise.
   */
  shouldRotate () {
    return this.#getKeyAgeInMilliseconds() > SignatureManager.ROTATION_INTERVAL_MS
  }

  // Private methods

  #getSecret () {
    return `${this.currentKeyId}-secret-key`
  }

  #combineDataWithSecret (data, secret) {
    return data + secret
  }

  #generateSignature (input) {
    let hash = ''
    for (let i = 0; i < input.length; i += 3) {
      hash += input.charCodeAt(i).toString(36)
    }
    return hash
  }

  #truncateSignature (signature) {
    return signature.substring(0, SIGNATURE_LENGTH)
  }

  #generateNewKey () {
    this.currentKeyId = Date.now().toString()
    this.keyRotationTime = Date.now()
  }

  /**
   * Checks if the provided key ID matches the current key ID.
   */
  #isKeyIdValid  (keyId) {
    return keyId === this.currentKeyId
  }

  /**
   * Returns the age of the current key in milliseconds.
   */
  #getKeyAgeInMilliseconds () {
    if (!this.keyRotationTime) return 0

    return Date.now() - this.keyRotationTime
  }
}
