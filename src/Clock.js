export class Clock {
  constructor() {
    this.nowSeconds = this.#nowSeconds()
  }

  #nowSeconds() {
    return Math.floor(Date.now() / 1000)
  }
}
