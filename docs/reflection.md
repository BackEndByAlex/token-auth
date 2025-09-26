# Reflection

## Namngivning (kapitel 2)

|      namn                        |      Förklaring                 | Reflektion och regler från Clean Code |
|----------------------------------|---------------------------------|---------------------------------------|
|        KeyManager                |  Klassen hanterar nyckel-ID:n och signaturer för JWT-tokens.  |  **Use Solution Domain Names:** Namnet använder teknisk terminologi som målgruppen (programmerare) förstår. **Class Names:** Substantiv som beskriver vad klassen representerar. **Avoid Disinformation:** Namnet kan vara missvisande eftersom klassen inte hanterar "riktiga" kryptografiska nycklar utan skapar hash-baserade signaturer. Ett mer exakt namn skulle vara *SignatureManager* eller *TokenSigner* som bättre beskriver den faktiska funktionaliteten. Där jag väljer *SignatureManager* namnet att byta ut till från *KeyManager*.                      |                        
|          issueToken                      |  Function som skapar en signerad JWT-token token med användardata, tidstämplar och unik identifierare.                         |   **Use Intention-Revealing Names:** Namnet "issueToken" avslöjar tydligt funktionens syfte - att utfärda/utge en auktoriserad token. **Don't Be Cute:** Namnet använder etablerad terminologi från JWT-standarden istället för kreativa alternativ som "makeToken" eller "craftToken".                                   |                         
| Base64Url                   |      Klass som hanterar encodning och decoding mellan vanliga strängar och base64url-format.                           |       **Use Solution Domain Names:** Namnet kombinerar två tekniska termer (Base64 och Url) som målgruppen känner till. **Avoid Disinformation:** Namnet är exakt - det handlar specifikt om base64url-varianten, inte vanlig base64. Make Meaningful Distinctions: Skiljer tydligt från "Base64" genom att specificera "Url"-varianten.                                |                         
|         verifyToken                         |        Funktion som kontrollerar om en JWT-token är giltig genom signaturverifiering och revocation-kontroll.                         |      **Use Searchable Names:** "verify" är ett sökbart och erkänt verb inom säkerhetsdomänen. **Avoid Mental Mapping:** Namnet kräver ingen översättning - utvecklare förstår direkt att funktionen verifierar något. Use Problem Domain Names: "Verify" är standard terminologi inom kryptografi och autentisering.                                 |                          
|    generateJti                    |       Metod som skapar en unik JWT-identifierare genom att kombinera timestamp och slumpmässiga tecken.                          |       **Use Intention-Revealing Names:** Namnet "generate" avslöjar tydligt att metoden skapar något nytt. **Avoid Mental Mapping:** Utvecklare behöver inte gissa vad "gen", "mk" eller liknande förkortningar betyder. **Pick One Word per Concept:** Konsekvent användning av "generate" för alla skapande-operationer i systemet, istället för att blanda "create", "make", "build" etc.                                |                                          


### Namngivning Reflektion

Kapitel 2 om namngivning har varit en ögonöppnare som visat mig hur mycket jag tidigare missade angående kodkvalitet. Insåg även att dåliga namn skapar förvirring.

Under arbetet med modulen märktes hur mycket tid som faktiskt går åt för att hitta bra namn. Först kändes det onödigt, men snabbt blev det tydligt att vaga eller missvisande namn försvårar  återanvändning av kod.

En stor utmaning var att vara konsekvent. Jag växlade automatiskt mellan "create", "generate" och "make" för samma koncept, vilket skapade onödig förvirring när man skulle komma ihåg vilket ord jag använt.

Det mest överraskande var hur namngivning påverkade min egen förståelse av koden. När man tvingades hitta riktigt beskrivande namn fick jag tänka djupare på vad funktionen faktiskt skulle göra. Ibland insåg man att funktionen gjorde för mycket, bara genom namngivningsprocessen.

  

## Funktioner (kapitel 3)

| Metodnamn                        |      Länk eller kod             | Antal rader (ej ws) |     Reflektion          |
|----------------------------------|---------------------------------|---------------------|-------------------------|
|    issueToken                              |  [issueToken](./reflection.md) lines 30-49                              |    16                 |       **Do One Thing:** Funktionen gör flera saker - roterar nycklar, skapar header, bygger payload, kodar och signerar. Borde delas upp i mindre funktioner. **Function Arguments:** Har två parametrar (dyadic) vilket är acceptabelt enligt Clean Code. **Small:** Med 16 rader är den för lång enligt "functions should be small" principen.                  |
|        rotateIfNeeded                          |      [rotateIfNeeded](./src/SignatureManager.js) lines 58-63                           |        6             |        **Small:** Bra storlek. **Do One Thing:** Kontrollerar tid och roterar vid behov - tekniskt sett två saker men nära relaterade. **Have No Side Effects:** Namnet antyder ingen side effect men funktionen ändrar faktiskt systemets tillstånd genom key generation.                 | 
|        verifyToken                          |    [verifyToken](./src/TokenService.js) lines   57-75                          |       15              |   **Do One Thing:** Gör flera saker - validerar format, dekoderar, kontrollerar revocation och verifierar signatur. **Small:** För lång med 15 rader. **Have No Side Effects:** Funktionen ändrar inte systemets tillstånd, bara returnerar verifieringsresultat.                      |
|        ecoded                          |     [ecoded](./src/base64Url.js) lines 13-21                            |       9              | **Small:** Med 9 rader följer funktionen 'functions should be small' principen. **Do One Thing:** Gör exakt en sak - konverterar string till base64url format. **Function Arguments:** Monadic (ett argument) vilket är idealt enligt Clean Code. **Use Descriptive Names:** Namnet beskriver tydligt vad funktionen gör.                |
|           sign                       |         [sign](./src/SignatureManager.js) lines 34-44                        |        9             |         **Small:** Med 9 rader ligger är den acceptabel. **Do One Thing:** Gör en sak - skapar signatur baserat på data och hemlig nyckel. **Function Arguments:** Monadic (ett argument) vilket är idealt enligt Clean Code.                |

### Funktioner Reflektion (Kapitel 3)

Kapitel 3 om funktioner har varit det svåraste att göra i praktiken. Principen att funktioner ska vara små låter självklar, men när man faktiskt kodar blir det mycket svårare än vad jag trodde.

Jag märkte att mina funktioner växte konstant. Börjar med en enkel idé, sedan behöver man lägga till validering, felhantering, och plötsligt är funktionen 15-20 rader lång. I stunden känns varje rad motiverad, men i efterhand såg jag att funktionen gör alldeles för mycket.

Det mest frustrerande var att försöka följa "gör en sak"-regeln. Vad räknas som "en sak"? Är att validera input och sedan bearbeta det en sak eller två saker? Jag insåg att gränsen ofta är suddigare än boken får det att låta.

Något som förvånade mig var hur mycket lättare koden blev att testa när jag delade upp större funktioner. Mindre funktioner betydde att jag kunde testa specifika delar isolerat istället för att behöva sätta upp komplicerade testscenarier.

Ett annan utmaning var att balansera läsbarhet mot Clean Code-reglerna. Ibland kändes det som att dela upp en funktion gjorde koden mer fragmenterad och svårare att följa, även om den tekniskt blev "renare".


## Refactoring

### IssueToken Function

- Koden före refactoring

``` javascript
  export function issueToken (payload, ttlSeconds) {
  signatureManager.rotateIfNeeded()
  const header = { alg: 'RS256', typ: 'JWT', kid: signatureManager.getCurrentKeyId() }
  const iat = clock.nowSeconds()
  const exp = iat + ttlSeconds

  const fullPayload = {
    ...payload,
    iat,
    exp,
    jti: jtiGenerator.generate() // Unique token ID for revocation
  }

  // Create JWT structure
  const headerEncoded = base64Url.encode(JSON.stringify(header))
  const payloadEncoded = base64Url.encode(JSON.stringify(fullPayload))
  const signature = signatureManager.sign(${headerEncoded}.${payloadEncoded})

  return ${headerEncoded}.${payloadEncoded}.${signature}
}
```

- Koden efter refactoring

``` javascript
export function issueToken (payload, ttlSeconds) {
  const jwtPayload = createJwtPayload(payload, ttlSeconds)
  const jwtParts = createJwtParts(jwtPayload)
  return signJwt(jwtParts)
}

function createJwtPayload (payload, ttlSeconds) {
  const iat = clock.nowSeconds()
  return {
    ...payload,
    iat,
    exp: iat + ttlSeconds,
    jti: jtiGenerator.generate() // Unique token ID for revocation
  }
}

function createJwtParts (payload) {
  signatureManager.rotateIfNeeded()
  const header = { alg: 'RS256', typ: 'JWT', kid: signatureManager.getCurrentKeyId() }

  return {
    header: base64Url.encode(JSON.stringify(header)),
    payload: base64Url.encode(JSON.stringify(payload))
  }
}

function signJwt (header, payload) {
  const signature = signatureManager.sign(${header}.${payload})
  return ${header}.${payload}.${signature}
}
```



### VerifyToken Function

- Koden före refactoring

``` javascript
export function verifyToken (token) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid format' }
  }

  const [headerEncoded, payloadEncoded, signature] = parts
  const payload = JSON.parse(base64Url.decode(payloadEncoded))

  if (revocation.isRevoked(payload.jti)) {
    return { valid: false, error: 'Token revoked' }
  }

  const dataVerify = `${headerEncoded}.${payloadEncoded}`
  const header = JSON.parse(base64Url.decode(headerEncoded))
  const isValid = signatureManager.verify(dataVerify, signature, header.kid)

  return { valid: isValid, payload }
}
```

- Koden efter refactoring

``` javascript
export function verifyToken (token) {
  try {
    const parts = parseTokenParts(token)
    const decoded = decodeTokenParts(parts)
    return validateTokenParts(parts, decoded)
  } catch (error) {
    return { valid: false, error: 'Verification failed' }
  }
}

function parseTokenParts (token) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }
  return parts
}

function decodeTokenParts (parts) {
  const [headerEncoded, payloadEncoded] = parts
  return {
    header: JSON.parse(base64Url.decode(headerEncoded)),
    payload: JSON.parse(base64Url.decode(payloadEncoded)),
    headerEncoded,
    payloadEncoded
  }
}

function validateTokenParts (parts, { header, payload, headerEncoded, payloadEncoded }) {
  if (revocation.checkIfRevoked(payload.jti)) {
    return { valid: false, error: 'Token revoked' }
  }

  const dataVerify = `${headerEncoded}.${payloadEncoded}`
  const isValid = signatureManager.verify(dataVerify, parts[2], header.kid)

  return { valid: isValid, payload }
}
```

## Huvudreflektion

Utvecklingen av JWT-modulen var ganska svårt. Clean Code-principerna från kapitel 2 och 3 har tvingat mig att tänka på kod som kommunikation mellan människor, inte bara instruktioner till datoren.

Den största insikten har varit att kvalitet i kod inte bara handlar om att lösa problemet, utan om hur lösningen kommuniceras. Tidigare fokuserade jag främst på funktionalitet - att koden bara fungerade var tillräckligt. Nu förstår man att läsbarhet och underhållbarhet är lika viktiga, särskilt när koden ska användas av andra utvecklare/programmerare.

Namngivning visade sig vara mycket mer komplext än jag förväntat mig. Det är lätt att underskatta hur mycket mental energi som krävs för att hitta namn som verkligen förklarar intentionen. Jag märkte att processen att hitta bra namn ofta hjälpte mig förstå vad koden faktiskt skulle göra, vilket ledde senare till bättre struktur.

Funktionsdesign har varit den största utmaningen. Principen att hålla funktioner små och fokuserade är svår att uttvekla. Ett annan grej var att ofta låter funktioner växa organiskt under utveckling istället för att planera deras struktur från början.

Arbetet med modulen har även lärt mig vikten av dokumentation och tydlig kommunikation. Att skriva för andra att använda, inte bara för mig själv, kräver ett helt annat förhållningssätt till kod.