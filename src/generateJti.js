/*
* Generates a unique token identifier (jti).
*/
export class JtiGenerator {
  generate() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9)
  }
}
