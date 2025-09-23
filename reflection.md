# Reflection

## Namngivning (kapitel 2)

|      namn                        |      Förklaring                 | Reflektion och regler från Clean Code |
|----------------------------------|---------------------------------|---------------------------------------|
|        KeyManager                |  Klassen hanterar nyckel-ID:n och signaturer för JWT-tokens.  |  **Use Solution Domain Names:** Namnet använder teknisk terminologi som målgruppen (programmerare) förstår. **Class Names:** Substantiv som beskriver vad klassen representerar. **Avoid Disinformation:** Namnet kan vara missvisande eftersom klassen inte hanterar "riktiga" kryptografiska nycklar utan skapar hash-baserade signaturer. Ett mer exakt namn skulle vara *SignatureManager* eller *TokenSigner* som bättre beskriver den faktiska funktionaliteten. Där jag väljer *SignatureManager* namnet att byta ut till från *KeyManager*.                      |                        
|          issueToken                      |  Function som skapar en signerad JWT-token token med användardata, tidstämplar och unik identifierare.                         |   **Use Intention-Revealing Names:** Namnet "issueToken" avslöjar tydligt funktionens syfte - att utfärda/utge en auktoriserad token. **Don't Be Cute:** Namnet använder etablerad terminologi från JWT-standarden istället för kreativa alternativ som "makeToken" eller "craftToken".                                   |                         
| Base64Url                   |      Klass som hanterar encodning och decoding mellan vanliga strängar och base64url-format.                           |       **Use Solution Domain Names:** Namnet kombinerar två tekniska termer (Base64 och Url) som målgruppen känner till. **Avoid Disinformation:** Namnet är exakt - det handlar specifikt om base64url-varianten, inte vanlig base64. Make Meaningful Distinctions: Skiljer tydligt från "Base64" genom att specificera "Url"-varianten.                                |                         
|         verifyToken                         |        Funktion som kontrollerar om en JWT-token är giltig genom signaturverifiering och revocation-kontroll.                         |      **Use Searchable Names:** "verify" är ett sökbart och erkänt verb inom säkerhetsdomänen. **Avoid Mental Mapping:** Namnet kräver ingen översättning - utvecklare förstår direkt att funktionen verifierar något. Use Problem Domain Names: "Verify" är standard terminologi inom kryptografi och autentisering.                                 |                          
|    generate                    |       Metod som skapar en unik JWT-identifierare genom att kombinera timestamp och slumpmässiga tecken.                          |       **Use Intention-Revealing Names:** Namnet "generate" avslöjar tydligt att metoden skapar något nytt. **Avoid Mental Mapping:** Utvecklare behöver inte gissa vad "gen", "mk" eller liknande förkortningar betyder. **Pick One Word per Concept:** Konsekvent användning av "generate" för alla skapande-operationer i systemet, istället för att blanda "create", "make", "build" etc.                                |                                          

## Funktioner (kapitel 3)

| Metodnamn                        |      Länk eller kod             | Antal rader (ej ws) |     Reflektion          |
|----------------------------------|---------------------------------|---------------------|-------------------------|
|    issueToken                              |  [issueToken](./src/TokenService.js) lines 25-40                              |    16                 |       **Do One Thing:** Funktionen gör flera saker - roterar nycklar, skapar header, bygger payload, kodar och signerar. Borde delas upp i mindre funktioner. **Function Arguments:** Har två parametrar (dyadic) vilket är acceptabelt enligt Clean Code. **Small:** Med 16 rader är den för lång enligt "functions should be small" principen.                  |
|                                  |                                 |                     |                         | 
|                                  |                                 |                     |                         |
|                                  |                                 |                     |                         |
|                                  |                                 |                     |                         |
|                                  |                                 |                     |                         |
|                                  |                                 |                     |                         |

