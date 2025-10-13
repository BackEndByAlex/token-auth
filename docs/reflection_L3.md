# Token-Auth Module Förbättring

## kapitel 2 

Jag har repeterat kapitel 2 om namngivning och i efterhand har jag upptäckt vissa klasser, metoder och tal som skulle kunna förbättras. Jag har nu använt principen "Use Intention-Revealing Names" genom att byta JtiGenerator till **TokenIdGenerator** och checkIfRevoked() till **isRevoked()**. Jag tyckte tidigare att det skulle göra koden mer avancerad bara genom att ha så långa namn på en metod, men nu i efterhand inser jag att koden blir mer läsbar. Därefter har jag tillämpat "Avoid Encodings" genom att förkorta getTimeInSeconds() till **now()**. Detta var ett fall där mitt långa namn gjorde det tydligt, men jag tänkte: varför inte "now"? Man skriver **clock.now()** vilket förklarar sig självt. Gällande "Magic Numbers" har jag lärt mig att använda static och skapa konstanter för att förklara vad dessa nummer gör istället. I linje med "Use Meaningful Names" blev talet 16 till SIGNATURE_LENGTH och **24 * 60 * 60 * 1000** blev ROTATION_INTERVAL_MS.

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

Efter att ha gått igenom kapitel 3 upptäckte jag att mina funktioner gjorde för mycket på en gång, vilket bröt mot principen "Functions Should Do One Thing". I signatureManager.js hade jag en sign()-metod på 7 rader som gjorde fyra olika saker samtidigt - skapa secret, kombinera data, generera hash och trunkera resultatet.

Det jag gjorde var att använda "One Level of Abstraction per Function" och dela upp den i fem små metoder där varje metod gör exakt en sak och arbetar på samma abstraktionsnivå. Nu följer koden "The Stepdown Rule" där sign() läses som en berättelse där varje privat metod representerar ett steg i processen. Jag insåg att även om detta skapade fler rader, så blev varje metod testbar isolerat och mycket lättare att förstå. Detta pekar även på principen "Small!" som handlar om att minimera totalt antal rader per funktion.

### Exempel från kod:

- FÖRE:

```javascript

sign(data) {
  const secret = this.currentKeyId + '-secret-key'
  const combined = data + secret
  let signature = ''
  for (let i = 0; i < combined.length; i += 3) {
    signature += charCodeAt(i).toString(36)
  }
  return signature.substring(0, 16)
}

```

- EFTER:

```javascript

sign(data) {
  const secret = this.#getSecret()
  const combined = this.#combineDataWithSecret(data, secret)
  const hash = this.#generateSignature(combined)
  return this.#truncateSignature(hash)
}

#getSecret() {
  return `${this.currentKeyId}-secret-key`
}

#combineDataWithSecret(data, secret) {
  return data + secret
}

#generateSignature(input) {
  let hash = ''
  for (let i = 0; i < input.length; i += 3) {
    hash += input.charCodeAt(i).toString(36)
  }
  return hash
}

#truncateSignature(signature) {
  return signature.substring(0, SignatureManager.SIGNATURE_LENGTH)
}

```

## kapitel 4 

Kapitel 4 var lite knäpigt. En princip jag implementerade "Explain Yourself in Code" och insåg att många av mina kommentarer bara upprepade vad koden redan sa. Jag hade JSDoc för nästan alla metoder på grund av linten, även privata, vilket gjorde koden rörig och skapade "Redundant Comments". 

Vidare "Comments Do Not Make Up for Bad Code" tog jag bort en helt del JSDoc från privata metoder där metodnamnet redan är självförklarande. Till exempel behöver inte #isValidBase64Url(input) en kommentar som säger "validates base64url characters" - namnet säger redan detta. Jag behöll dock viktiga "Warning of Consequences" som varnar för att RevocationStore är in-memory och data förloras vid restart.

- FÖRE:
```javascript

/**
 * Validates that the input contains only valid base64url characters.
 * @param {string} input - The input string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
#isValidBase64Url(input) {
  return /^[A-Za-z0-9_-]*$/.test(input)
}

```

- EFTER:

```javascript

#isValidBase64Url(input) {
  return /^[A-Za-z0-9_-]*$/.test(input)
}

```

- MEN: "Warning of Consequences"

```javascript

/**
 * In-memory store for managing revoked tokens.
 *
 * Warning: Revoked tokens are stored in memory and will be lost on application restart.
 * For production use, consider a persistent storage solution (e.g., Redis, database).
 */
export class RevocationStore {}

```

## kapitel 5 

## kapitel 6 

## kapitel 7 

## kapitel 8 

## kapitel 9 

## kapitel 10 

## kapitel 11