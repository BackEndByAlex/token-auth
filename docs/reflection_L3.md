# Token-Auth Module Förbättring

## kapitel 2 

Jag har repeterat kapitel 2 om namngivning och i efterhand har jag upptäckt vissa klasser, metoder och tal som skulle kunna förbättras. Jag har nu använt principen "Use Intention-Revealing Names" genom att byta JtiGenerator till **TokenIdGenerator** och checkIfRevoked() till **isRevoked()**. Jag tyckte tidigare att det skulle göra koden mer avancerad bara genom att ha så långa namn på en metod, men nu i efterhand inser jag att koden blir mer läsbar. Därefter har jag tillämpat "Avoid Encodings" genom att förkorta getTimeInSeconds() till **now()**. Detta var ett fall där mitt långa namn gjorde det tydligt, men jag tänkte: varför inte "now"? Man skriver **clock.now()** vilket förklarar sig självt. Gällande "Magic Numbers" har jag lärt mig att använda static och skapa konstanter för att förklara vad dessa nummer gör istället. I linje med "Use Meaningful Names" blev talet 16 till SIGNATURE_LENGTH och **24*60*60*1000** blev ROTATION_INTERVAL_MS.

### Exempel från kod:

- FÖRE

```javascript

class JtiGenerator {
  generateJti() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9)
  }
}

```

- EFTER:

```javascript
export class TokenIdGenerator {
  static RANDOM_STRING_LENGTH = 7
  static BASE36_RADIX = 36
  static RANDOM_PREFIX_LENGTH = 2

  generate () {
    const timestamp = this.#getTimestamp()
    const randomPart = this.#generateRandomString()
    return timestamp + randomPart
  }

  #getTimestamp () {
    return Date.now().toString()
  }

  #generateRandomString () {
    return Math.random()
      .toString(TokenIdGenerator.BASE36_RADIX)
      .substring(
        TokenIdGenerator.RANDOM_PREFIX_LENGTH,
        TokenIdGenerator.RANDOM_PREFIX_LENGTH + TokenIdGenerator.RANDOM_STRING_LENGTH
      )
  }
}
```

## kapitel 3

## kapitel 4 

## kapitel 5 

## kapitel 6 

## kapitel 7 

## kapitel 8 

## kapitel 9 

## kapitel 10 

## kapitel 11