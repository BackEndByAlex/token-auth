# Reflection

## Namngivning (kapitel 2)

|      namn                        |      Förklaring                 | Reflektion och regler från Clean Code |
|----------------------------------|---------------------------------|---------------------------------------|
|        KeyManager                |  Klassen hanterar nyckel-ID:n och signaturer för JWT-tokens.  |  **Use Solution Domain Names:** Namnet använder teknisk terminologi som målgruppen (programmerare) förstår. **Class Names:** Substantiv som beskriver vad klassen representerar. **Avoid Disinformation:** Namnet kan vara missvisande eftersom klassen inte hanterar "riktiga" kryptografiska nycklar utan skapar hash-baserade signaturer. Ett mer exakt namn skulle vara *SignatureManager* eller *TokenSigner* som bättre beskriver den faktiska funktionaliteten. Där jag väljer *SignatureManager* namnet att byta ut till från *KeyManager*.                      |                        
|          issueToken                      |  Function som skapar en signerad JWT-token token med användardata, tidstämplar och unik identifierare.                         |   **Use Intention-Revealing Names:** Namnet "issueToken" avslöjar tydligt funktionens syfte - att utfärda/utge en auktoriserad token. **Don't Be Cute:** Namnet använder etablerad terminologi från JWT-standarden istället för kreativa alternativ som "makeToken" eller "craftToken".                                   |                         
| Base64Url                   |      Klass som hanterar encodning och decoding mellan vanliga strängar och base64url-format.                           |       **Use Solution Domain Names:** Namnet kombinerar två tekniska termer (Base64 och Url) som målgruppen känner till. **Avoid Disinformation:** Namnet är exakt - det handlar specifikt om base64url-varianten, inte vanlig base64. Make Meaningful Distinctions: Skiljer tydligt från "Base64" genom att specificera "Url"-varianten.                                |                         
|         verifyToken                         |        Funktion som kontrollerar om en JWT-token är giltig genom signaturverifiering och revocation-kontroll.                         |      **Use Searchable Names:** "verify" är ett sökbart och erkänt verb inom säkerhetsdomänen. **Avoid Mental Mapping:** Namnet kräver ingen översättning - utvecklare förstår direkt att funktionen verifierar något. Use Problem Domain Names: "Verify" är standard terminologi inom kryptografi och autentisering.                                 |                          
|    generate                    |       Metod som skapar en unik JWT-identifierare genom att kombinera timestamp och slumpmässiga tecken.                          |       **Use Intention-Revealing Names:** Namnet "generate" avslöjar tydligt att metoden skapar något nytt. **Avoid Mental Mapping:** Utvecklare behöver inte gissa vad "gen", "mk" eller liknande förkortningar betyder. **Pick One Word per Concept:** Konsekvent användning av "generate" för alla skapande-operationer i systemet, istället för att blanda "create", "make", "build" etc.                                |                                          


### Namngivning Reflection

  

## Funktioner (kapitel 3)

| Metodnamn                        |      Länk eller kod             | Antal rader (ej ws) |     Reflektion          |
|----------------------------------|---------------------------------|---------------------|-------------------------|
|    issueToken                              |  [issueToken](./src/TokenService.js) lines 30-49                              |    16                 |       **Do One Thing:** Funktionen gör flera saker - roterar nycklar, skapar header, bygger payload, kodar och signerar. Borde delas upp i mindre funktioner. **Function Arguments:** Har två parametrar (dyadic) vilket är acceptabelt enligt Clean Code. **Small:** Med 16 rader är den för lång enligt "functions should be small" principen.                  |
|        rotateIfNeeded                          |      [rotateIfNeeded](./src/SignatureManager.js) lines 58-63                           |        6             |        **Small:** Bra storlek. **Do One Thing:** Kontrollerar tid och roterar vid behov - tekniskt sett två saker men nära relaterade. **Have No Side Effects:** Namnet antyder ingen side effect men funktionen ändrar faktiskt systemets tillstånd genom key generation.                 | 
|        verifyToken                          |    [verifyToken](./src/TokenService.js) lines   57-75                          |       15              |   **Do One Thing:** Gör flera saker - validerar format, dekoderar, kontrollerar revocation och verifierar signatur. **Small:** För lång med 15 rader. **Have No Side Effects:** Funktionen ändrar inte systemets tillstånd, bara returnerar verifieringsresultat.                      |
|        ecode                          |     [ecode](./src/base64Url.js) lines 13-21                            |       9              | **Small:** Med 9 rader följer funktionen 'functions should be small' principen. **Do One Thing:** Gör exakt en sak - konverterar string till base64url format. **Function Arguments:** Monadic (ett argument) vilket är idealt enligt Clean Code. **Use Descriptive Names:** Namnet beskriver tydligt vad funktionen gör.                |
|           sign                       |         [sign](./src/SignatureManager.js) lines 34-44                        |        9             |         **Small:** Med 9 rader ligger är den acceptabel. **Do One Thing:** Gör en sak - skapar signatur baserat på data och hemlig nyckel. **Function Arguments:** Monadic (ett argument) vilket är idealt enligt Clean Code.                |

### Funktioner reflection


#### Refactoring

## Huvud reflections
