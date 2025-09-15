let currentKeyId = null
let privateKey = null
let keyRotationTime = null

export class KeyManager {
  constructor() {
    this.rotateIfNeeded = this.#rotateIfNeeded()
    this.getCurrentKeyId = this.#getCurrentKeyId()
    this.sign = this.#sign()
    this.generateNewKey = this.#generateNewKey()
  }

  /*
  * Checks if the current key needs to be rotated based on the rotation time.
  * If the key is older than 24 hours, it generates a new key.
  */
  #rotateIfNeeded() {
    const now = Date.now()
    if (!keyRotationTime || now >= keyRotationTime - 24 * 60 * 60 * 1000) { // Rotate every 24 hours
      this.#generateNewKey()
    }
  }

  /*
    * Returns the current key ID.
    * If no key exists, it generates a new one.
  */
  #getCurrentKeyId() {
    if (!currentKeyId) {
      this.#generateNewKey()
    }
    return currentKeyId
  }

  #sign() {

  }

  /*
    * Generates a new RSA key pair and updates the current key ID and rotation time.
  */
  #generateNewKey() {
    currentKeyId = Date.now().toString()
    keyRotationTime = Date.now()
  }
}
