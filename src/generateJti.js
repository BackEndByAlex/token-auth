/*
  * Generates a unique token identifier (jti).
  * Jti = JSON Token Identifier
*/
export class JtiGenerator {
  generate () {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9)
  }
}
