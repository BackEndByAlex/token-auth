/*
  * The function encodes the input string to base64 using btoa.
  * It then replaces '+' with '-', '/' with '_', and removes any trailing '=' characters to convert from base64 to base64url.
  * Finally, it returns the modified string.
*/
export function encode(input) {
  const base64 = btoa(input)
  const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return base64Url
}

/*
  * The function decodes a base64url-encoded string back to its original form.
  * It first replaces '-' with '+' and '_' with '/' to convert from base64url to base64.
  * Then, it adds padding characters ('=') if necessary to make the length of the string a multiple of 4.
  * Finally, it decodes the modified string using atob and returns the result.
*/
export function decode(input) {
  const decode = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = decode.length % 4 === 0 ? '' : '='.repeat(4 - (decode.length % 4))
  return atob(decode + padding)
}
