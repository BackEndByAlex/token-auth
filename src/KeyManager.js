let currentKeyId = null
let privateKey = null
let keyRotationTime = null

/*
  * Checks if the current key needs to be rotated based on the rotation time.
  * If the key is older than 24 hours, it generates a new key.
*/
export function rotateIfNeeded() {
  const now = Date.now()
  if (!keyRotationTime || now >= keyRotationTime - 24 * 60 * 60 * 1000) { // Rotate every 24 hours
    generateNewKey()
  }
}

/*
  * Returns the current key ID.
  * If no key exists, it generates a new one.
*/
export function getCurrentKeyId() {
  if (!currentKeyId) {
    generateNewKey()
  }
  return currentKeyId
}

export function sign() {

}

/*
  * Generates a new RSA key pair and updates the current key ID and rotation time.
*/
function generateNewKey() {
  currentKeyId = Date.now().toString()
  keyRotationTime = Date.now()
}
