export class Clock {
  nowSeconds() {
    return Math.floor(Date.now() / 1000)
  }
}
