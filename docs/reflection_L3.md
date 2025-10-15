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
  static #RANDOM_STRING_LENGTH = 7
  static #BASE36_RADIX = 36
  static #RANDOM_PREFIX_LENGTH = 2

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
      .toString(TokenIdGenerator.#BASE36_RADIX)
      .substring(
        TokenIdGenerator.#RANDOM_PREFIX_LENGTH,
        TokenIdGenerator.#RANDOM_PREFIX_LENGTH + TokenIdGenerator.#RANDOM_STRING_LENGTH
      )
  }
}
```

## kapitel 3

Efter att ha gått igenom kapitel 3 upptäckte jag att mina funktioner gjorde **för mycket** på en gång, vilket bröt mot principen "Functions Should Do One Thing". I signatureManager.js hade jag en sign()-metod **på 7 rader** som gjorde fyra olika saker samtidigt: skapa secret, kombinera data, generera hash och trunkera resultatet.

Det jag gjorde var att använda "One Level of Abstraction per Function" och dela upp den i **fem små metoder** där varje metod gör exakt en sak och arbetar på samma abstraktionsnivå. Nu följer koden "The Stepdown Rule" där sign() läses som en berättelse där varje privat metod representerar ett steg i processen. Jag insåg att även om detta skapade fler rader, så blev varje metod testbar isolerat och mycket **lättare att förstå**. Detta pekar även på principen "Small!" som handlar om att minimera totalt antal rader per funktion.

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
  return signature.substring(0, SignatureManager.#SIGNATURE_LENGTH)
}

```

## kapitel 4 

Kapitel 4 var lite knäpigt. En princip jag implementerade "Explain Yourself in Code" och insåg att många av mina kommentarer bara upprepade vad koden redan sa. Jag hade JSDoc för nästan alla metoder på grund av **linten**, även privata, vilket gjorde koden rörig och skapade "Redundant Comments". 

Vidare "Comments Do Not Make Up for Bad Code" tog jag bort en helt del JSDoc från privata metoder där metodnamnet redan är **självförklarande**. Till exempel, #getKeyAgeInMilliseconds() metoden behöver inte  en kommentar som säger " current key in milliseconds". Anledningen namnet säger redan detta. Jag behöll dock viktiga "Warning of Consequences" som varnar för att RevocationStore är in-memory och data förloras vid restart som beskrivning för klassen.

### Exempel från kod:

- FÖRE:
```javascript

/**
 * Returns the age of the current key in milliseconds.
 */
#getKeyAgeInMilliseconds () {
  if (!this.keyRotationTime) return 0

  return Date.now() - this.keyRotationTime
}

```

- EFTER:

```javascript

#getKeyAgeInMilliseconds () {
  return !this.keyRotationTime ? 0 : Date.now() - this.keyRotationTime
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

Under tiden jag läste insåg jag att "konsistent formatering" är viktigt. Anlednigen är att koden ska se professionell ut enligt "The Purpose of Formatting". Jag hade **blandat spacing**, ibland constructor () med mellanslag och ibland constructor() och andra methoder. Detta var en **lint problem**. Varför säger jag det, **linten ville** ha "contructor()" men jag ville "constructor ()", vilket bröt mot "Team Rules". Då fick jag tabort linten och köra på min struktur alltså på andra alternativen. 

Vidare fick jag använda "Horizontal Formatting" genom **hela projektet** med korrekt "Indentation" och "Horizontal Openness and Density". Jag gjorde också "Vertical Formatting" genom att **organisera metoder enligt "The Newspaper Metaphor"** där publika metoder kommer först, alltså de viktiga sedan följt av privata implementation details. Vilket följer "Vertical Ordering". Ett annant fel var filnamnen. De var också **inkonsistenta**. Några med PascalCase (TokenService.js) och andra med camelCase (base64Url.js). Nu använder alla filer camelCase enligt "Team Rules".

### Exempel från kod:

- FÖRE bryter mot "Team Rules":
```javascript

constructor() {  } // Inkonsekvent ingen spacing
TokenService.js // PascalCase filnamn
encode (input) {  } // Ingen consistency

```

- EFTER:
```javascript

constructor () { } // Konsekvent spacing
tokenService.js // camelCase överallt
encode (input) { }

```

- "Vertical Ordering" enligt "The Newspaper Metaphor":
```javascript

class TokenValidator {
  validateTokenParts() { ... }  // Publika metoder först
  
  #isExpired() { ... }          // Privata hjälp methoder sen
  #isRevoked() { ... }
  #hasValidSignature() { ... }
}

```

## kapitel 6 

I kapitel 6  pratade de mycket om skillnaden mellan objects (döljer data, exponerar behavior) och data structures (exponerar data) genom "Data/Object Anti-Symmetry". Genom att skapa **"Data Abstraction"**. Utifrån det gjorde, jag mina klasser som Base64Url exempelvis till **riktiga objects** med privata metoder för implementation och publika för "behavior". Som vidare döljer hur **base64url-konvertering faktiskt fungerar**. Detta följer "Hiding Structure" där användaren inte behöver veta om **implementation details**. 

### Exempel från kod:

- FÖRE:

```javascript

encode (input) {
    try {
      const base64 = btoa(input)
      const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      return base64Url
    } catch (error) {
      throw new Error('Failed to encode to Base64Url')
    }
  }

```

- EFTER "Data Abstraction" och "Hiding Structure":

```javascript

encode (input) {
    try {
      const base64 = btoa(input)
      return this.#convertBase64ToBase64Url(base64)
    } catch (error) {
      throw new Error(`Failed to encode to base64url: ${error.message}`)
    }
  }

```

## kapitel 7 

Kapitel 7 vissade mig att mina error handling var för för enkla och gav inte **tillräckligt med information**. Utifrån den tanke har jag gjorde vissa förrendrigar utifrån "Provide Context with Exceptions" började jag inkludera ursprungsfelmeddelandet i mina errors. Alltså istället för bara "Failed to encode to Base64Url" skriver jag nu "Failed to encode base64url: ${error.message}". 

Jag övervägde med att skapa custom error classes för att följa "Define Exception Classes in Terms of a Caller's Needs", men insåg att ingen av min kod **faktiskt behöver olika exception-typer för hantering**. Istället valde jag tydliga felmeddelanden med standard Error-klassen enligt "Use Exceptions Rather Than Return Codes", vilket är enklare och tillräckligt för detta projekt från min pespektiv.

### Exempel från kod:

- FÖRE:

```javascript

encode (input) {
    try {
      const base64 = btoa(input)
      const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      return base64Url
    } catch (error) {
      throw new Error('Failed to encode to Base64Url')
    }
  }

```

- EFTER:

```javascript

encode (input) {
    try {
      const base64 = btoa(input)
      return this.#convertBase64ToBase64Url(base64)
    } catch (error) {
      throw new Error(`Failed to encode to base64url: ${error.message}`)
    }
  }

```

## kapitel 8 

Utifrån kapitel 8 "Boundaries" hanterade jag **boundaries** mot external dependencies, även built-in APIs som mitt projekt använder för att fungera. Genom att tillämpa "Using Third-Party Code" wrappade jag Date.now() i min Clock klass och btoa/atob i Base64Url. Utifrån booken skapar det "Clean Boundaries" mellan min kod och externa APIs. Även om jag försökte undvika built-in APIs för att inte försvåra för mig och koden. Min beslut blev att jag använda btoa och atob för att kunna** skapa kryptografin**. Jag behövde läsa på dessa APIs men det underlättade **enormt** i implementationen. Detta följer "Exploring and Learning Boundaries" där jag lärde mig hur **base64-encoding fungerar** samtidigt som jag isolerade beroendet i en egen klass.

### Exempel från kod:

- FÖRE:

```javascript

createJwtPayload(payload, ttl) {
  const iat = Math.floor(Date.now() / 1000)  // Svår att testa
  return { ...payload, iat, exp: iat + ttl }
}


```

- EFTER:

```javascript

export class Clock {
  static #SECONDS_IN_MILLISECOND = 1000

  now () {
    return Math.floor(Date.now() / Clock.#SECONDS_IN_MILLISECOND)
  }
}

createJwtPayload (payload, timeToLiveSeconds) {
    const iat = this.clock.now()
    return {
      ...payload,
      iat,
      exp: iat + timeToLiveSeconds,
      jti: this.tokenIdGenerator.generate()
    }
  }

```

## kapitel 9 

Jag skrev inte testerna först enligt "The Three of TDD", så jag behövde designa koden för att vara testbar enligt "Keeping Tests Clean". Genom att fokusera på "F.I.R.S.T" principles (Fast, Independent, Repeatable, Self-Validating, Timely) refaktorerade jag metoder som rotateIfNeeded() för att vara testbar. Den använder nu shouldRotate() som kan testas utan side effects. Jag designade för "Single Concept per Test" genom att **bryta ner stora metoder i små**, testbara units där varje metod testar ett koncept. Jag **strulade** med detta koncept på vissa ställen där jag inte kunde bryta ner metoderna så mycket, men på andra ställen fungerade det väl. 

Jag skapade också två testfiler med visuella checkmarks och pass/fail counters vilket följer "Clean Tests". Mitt mål med testerna var att göra dem enkla att läsa och förstå när man kör dem för att se vad som fungerar. Vidare ville jag även skapa två olika stora **testfall**. Där en av dem testar mina functions som användare använder och mitt andra testfall testar mina publika moduler som är grundpelarna i systemet.

### Exempel från kod:

- FÖRE:

```javascript

rotateIfNeeded() {
  const now = Date.now()
  if (!this.keyRotationTime || now - this.keyRotationTime > 24*60*60*1000) {
    this.#generateNewKey()
  }
}

```

- EFTER:

```javascript
#ROTATION_INTERVAL_MS = 24*60*60*1000

rotateIfNeeded () {
  if (this.shouldRotate()) {
    this.#generateNewKey()
  }
}

shouldRotate () {
  return this.#getKeyAgeInMilliseconds() > SignatureManager.#ROTATION_INTERVAL_MS
}

```

- "Clean Tests":

```javascript

const shouldRotate = sigManager.shouldRotate()
test('Newly rotated key should not need rotation', shouldRotate === false)

```

## kapitel 10 

Detta kapitlet var utifrån mig det mest påverkande i min kod. Först insåg jag att "Classes Should Be Small" inte bara handlar om **radantal** utan om "Single Responsibility Principle". Från vad jag förstod ska varje klass ha ett enda syfte. 

Mina klasser som Clock (1 metod) och TokenIdGenerator (1 metod) följer detta väl och har hög "Cohesion" där alla delar arbetar mot samma mål. Men inte alla mina klasser är så, ett bra exempel är min **SignatureManager**. Utifrån boken skulle den delas upp, eftersom den hanterar både key management och signing/verification, vilket verkar bryta mot det tidigare sagda "Single Responsibility Principle". Men genom att applicera principen "Organizing for Change" insåg jag att **key rotation och signing** är så tätt sammankopplade att de hör ihop, alltså de arbetar mot samma mål. 

Jag strulade lite med detta, eftersom boken säger att klasser ska vara små, men jag tänkte att om jag delar upp den så förlorar jag "Cohesion" mellan metoderna. 

Att dela upp dem hade gjort koden mer komplex utan att ge verkligt **värde** från mitt perspektiv. Men detta visar att SRP inte betyder "minsta möjliga klass" utan "one reason to change".

SignatureManager har ett tydligt syfte och alla metoder arbetar mot det syftet, vilket är bra design. Att göra fler ändringar skulle leda till flera klasser och framöver till flera filer som kan **påverka förståelsen** men framöver bryter mot "Cohesion". Jag valde i slutändan att inte bryta upp min klass mer än vad jag gjorde nu på grund av det och tiden som man har för att kunna göra det. Detta leder till att just klassen SignatureManager **kan utvecklas vidare** och delas ut i flera mindre klasser för att göra SRP ännu tydligare i framtiden.

### Exempel från kod:

- Följer "Classes Should Be Small" och SRP:

```javascript

export class Clock {
  static #SECONDS_IN_MILLISECOND = 1000

  now () {
    return Math.floor(Date.now() / Clock.#SECONDS_IN_MILLISECOND)
  }
}

export class TokenIdGenerator {

  generate () {
    const timestamp = this.#getTimestamp()
    const randomPart = this.#generateRandomString()
    return timestamp + randomPart
  }
}

```

"Organizing for Change", lätt att ändra implementation:

```javascript

#generateSignature (input) {
    let hash = ''
    for (let i = 0; i < input.length; i += 3) {
      hash += input.charCodeAt(i).toString(36)
    }
    return hash
  }

```

"Cohesion": SignatureManager behöll metoderna tillsammans:

```javascript

class SignatureManager {
  getCurrentKeyId() { ... } // Key access
  rotateIfNeeded() { ... } // Key lifecycle
  sign(data) { ... } // Signature creation
  verify(data, signature, keyId) { ... } // Signature validation
}
```

## kapitel 11

**Detta kapitlet påverkade tekniskt sett hela mitt system.** 

Mitt största beslut skulle har varit om jag skulle refaktorera från function-based module till class-based med full "Dependency Injection" enligt "Separate Constructing a System from Using It". Däremot är inte hela systemet gjort så, min huvudfil "tokenService" är function-baserad för att kunna göra det **enkelt** för användare att anropa mina funktioner i sitt system. 

Allt detta tyckte jag i början var **rätt**. Nu när jag funderar på det skulle jag vilja byta från functions till class i hela min fil, men på grund av tidsbristen hade jag inte den möjligheten. Anledningen är att jag hade behövt göra om hela min **factory class**, om man kan kalla den så, och lära om mina användare att kalla på klassen och sedan anropa den metoden som de behöver, men det tar tid som jag inte har just nu.

Class-based med DI hade gett perfekt testability och följt textbook Clean Architecture, men det hade också gjort API:t mer komplext för användare som bara vill använda issueToken(). Jag valde en **hybrid-approach** där jag tillämpar "Separation of Main". Alltså behåller enkla exporterade funktioner som public API (JavaScript-idiomatiskt och enkelt) men bygger internt med klasser och dependency injection för att följa "Dependency Injection" principen. 

Detta var svårt att bestämma eftersom jag kunde se fördelarna med båda sätten. Function-based är enklare för användaren men class-based är bättre för testning och "Scaling Up" i framtiden. Jag insåg att jag kan ha båda genom att constructionen sker inuti modulen enligt "Factories" mönstret medan användningen är simpel utifrån. Det optimerar olika lager för olika mål enligt "Optimize Decision Making".**Med andra ord externt API för enkelhet och internt för maintainability och "Cross-Cutting Concerns".** 

I framtiden kan systemet växa genom att bara byta ut de interna klasserna utan att påverka användarna, vilket följer "Test Drive the System Architecture" där arkitekturen kan utvecklas över tid.

### Exempel från kod:

EXTERNT API, enkelt för användare:

```javascript

import { issueToken } from './tokenService.js'
const token = issueToken({ userId: 1 }, 3600)

```

INTERNT, "Dependency Injection" och "Separation of Main":

```javascript

const clock = new Clock()
const tokenIdGenerator = new TokenIdGenerator()
const signatureManager = new SignatureManager()

// Dependencies injiceras
const tokenBuilder = new TokenBuilder(
  clock,
  tokenIdGenerator,
  signatureManager
)

// Public API wrapper
export function issueToken(payload, ttl) {
  return tokenBuilder.createToken(payload, ttl)
}

```

INTERNT, "Dependency Injection" och "Separation of Main": (framtiden)

```javascript

const revocationStore = new RedisRevocationStore()

```