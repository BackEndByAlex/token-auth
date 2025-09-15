/*
* Generates a unique token identifier (jti).
*/
export class JtiGenerator {
  constructor() {
    this.generatedJti = this.#generate()
  }

  #generate() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9)
  }
}
