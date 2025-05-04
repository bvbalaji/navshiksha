// This is a simple polyfill for the punycode module using tr46
const tr46 = require("tr46")

// Export the main functions that punycode provides
module.exports = {
  // Convert Unicode to ASCII/Punycode
  encode: (input) => tr46.toASCII(input),

  // Convert Punycode to Unicode
  decode: (input) => tr46.toUnicode(input),

  // Convert a domain name to Punycode
  toASCII: (domain) => tr46.toASCII(domain),

  // Convert a Punycode domain name to Unicode
  toUnicode: (domain) => tr46.toUnicode(domain),

  // Utility function to check if a string contains Unicode
  ucs2: {
    decode: (string) => Array.from(string).map((char) => char.charCodeAt(0)),
    encode: (codePoints) => String.fromCharCode.apply(null, codePoints),
  },
}
