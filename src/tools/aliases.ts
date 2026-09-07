/**
 * Phrases that, when they appear in another tool's article, should link to this tool.
 * Used by the contextual linkifier in ToolArticle. Keep them specific enough not to
 * hijack unrelated sentences; matching is case-insensitive and whole-word.
 */
export const toolAliases: Record<string, string[]> = {
  "json-formatter": ["JSON formatter", "format JSON", "pretty print JSON", "minify JSON"],
  base64: ["Base64", "base64url"],
  "url-encoder": ["URL encoding", "percent-encoding", "URL encoder", "encodeURIComponent"],
  "jwt-decoder": ["JSON Web Token", "JWT", "JWT decoder"],
  "uuid-generator": ["UUID", "GUID"],
  "hash-generator": ["SHA-256", "MD5", "hash generator", "checksum"],
  "regex-tester": ["regular expression", "regex tester", "regex"],
  "word-counter": ["word count", "word counter", "character count"],
  "case-converter": ["camelCase", "snake_case", "case converter", "title case"],
  "password-generator": ["password generator", "passphrase", "strong password"],
  "color-converter": ["HEX color", "contrast ratio", "color converter", "hex to rgb"],
  "unit-converter": ["unit converter", "unit conversion"],
  "loan-calculator": ["loan calculator", "loan payment", "amortization schedule"],
  "compound-interest-calculator": ["compound interest", "compound interest calculator"],
  "percentage-calculator": ["percentage change", "percentage calculator", "percentage increase"],
  "qr-code-generator": ["QR code", "QR code generator"],
  "unix-timestamp-converter": ["Unix timestamp", "epoch time", "timestamp converter"],
  "image-compressor": ["compress images", "image compressor", "image compression"],
  "image-resizer": ["resize images", "image resizer"],
  "text-diff": ["diff checker", "text diff", "compare two texts"],
};
