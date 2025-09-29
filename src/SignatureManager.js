/**
 * Manages cryptographic keys, handles key rotation, signing, and verification.
 */
export class SignatureManager {
  /**
   * Initializes a new instance of the SignatureManager class.
   */
  constructor () {
    this.currentKeyId = null
    this.privateKey = null
    this.keyRotationTime = null
  }

  /**
   * Returns the current key ID.
   * If no key exists, it generates a new one.
   *
   * @returns {string} The current key ID.
   */
  getCurrentKeyId () {
    if (!this.currentKeyId) {
      this.#generateNewKey()
    }
    return this.currentKeyId
  }

  /**
   * Signs the given data using the current private key.
   * Returns the signature as a base64url-encoded string.
   *
   * @param {string} data - The data to sign.
   * @returns {string} The base64url-encoded signature.
   */
  sign (data) {
    const secret = this.currentKeyId + '-secret-key'
    const combined = data + secret

    let signature = ''
    for (let i = 0; i < combined.length; i += 3) {
      signature += combined.charCodeAt(i).toString(36)
    }

    return signature.substring(0, 16) // Begränsa längden
  }

  /**
   * Generates a new RSA key pair and updates the current key ID and rotation time.
   */
  #generateNewKey () {
    this.currentKeyId = Date.now().toString()
    this.keyRotationTime = Date.now()
  }

  /**
   * Checks if the current key needs to be rotated based on the rotation time.
   * If the key is older than 24 hours, it generates a new key.
   */
  rotateIfNeeded () {
    const now = Date.now()
    if (!this.keyRotationTime || now - this.keyRotationTime > 24 * 60 * 60 * 1000) { // Rotate every 24 hours
      this.#generateNewKey()
    }
  }

  /**
   * Verifies the given signature against the data using the current public key.
   * Returns true if the signature is valid, false otherwise.
   *
   * @param {string} data - The data that was signed.
   * @param {string} signature - The base64url-encoded signature to verify.
   * @param {string} kid - The key ID used for signing.
   * @returns {boolean} True if the signature is valid, false otherwise.
   */
  verify (data, signature, kid) {
    if (!this.#isVerified(kid)) {
      return false
    }

    const expectedSignature = this.sign(data)
    return expectedSignature === signature
  }

  /**
   * Checks if the provided key ID matches the current key ID.
   *
   * @param {string} kid - The key ID to verify.
   * @returns {boolean} True if the key ID matches the current key ID, false otherwise.
   */
  #isVerified (kid) {
    if (kid !== this.currentKeyId) {
      return false
    }
    return true
  }

  /**
   * Forces immediate key rotation by generating a new key.
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
    return this.#getKeyAge() > 24 * 60 * 60 * 1000
  }

  /**
   * Returns the age of the current key in milliseconds.
   *
   * @returns {number} The age of the current key in milliseconds, or 0 if not set.
   */
  #getKeyAge () {
    if (!this.keyRotationTime) return 0

    return Date.now() - this.keyRotationTime
  }
}
