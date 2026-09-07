import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const urlEncoder: ToolDefinition = {
  slug: "url-encoder",
  category: "developer",
  name: "URL Encoder / Decoder",
  shortDescription: "URL encoder and decoder for query strings, paths and full URLs, in one click.",
  keywords: [
    "url encoder",
    "url decoder",
    "url encode online",
    "url decode online",
    "percent encoding",
    "encodeuricomponent",
    "encodeuri",
    "query string encoder",
    "%20 to space",
    "decode url",
    "urlencode",
    "escape url",
    "uri encoder",
    "url escape characters",
  ],
  related: ["base64", "json-formatter", "jwt-decoder"],
  icon: "%",
  component: Tool,
  content: {
    en: {
      title: "URL Encoder & Decoder Online: Percent-Encoding",
      description:
        "Free URL encoder and decoder. Percent-encode query strings and URLs with encodeURIComponent or encodeURI, decode %20 and UTF-8 escapes in your browser.",
      intro: [
        "This URL encoder and decoder converts text to percent-encoded form and back, using the same encodeURIComponent and encodeURI functions that browsers and Node.js call, so the output matches what your own code produces. URLs may only contain a limited set of ASCII characters; spaces, accented letters, emoji and reserved symbols such as ? & # and / have to be written as escapes like %20 or %C3%A9. Front-end and back-end developers, SEO specialists building tracking links and anyone debugging a broken redirect will find it useful. It runs client-side in your browser, so the URLs and parameters you paste are never sent anywhere.",
        "Two scopes cover the common cases. Component encodes everything except unreserved characters and suits a single query value, path segment or form field, turning a search phrase into q=caf%C3%A9%20au%20lait. Full URL leaves the structural characters of an address intact so a complete link stays navigable while spaces and non-ASCII letters are escaped.",
        "Typical jobs include decoding a UTM-laden link from an email, checking why a redirect parameter is double-encoded, or preparing a value for a curl request. The decoder validates every escape, so a lone % produces a clear message instead of corrupted text.",
      ],
      howTo: [
        "Select Encode or Decode at the top.",
        "Choose a Scope: Component for a single value such as a query parameter, or Full URL for a complete address that keeps : / ? # & =.",
        "Paste or type into the left box; the converted result appears instantly in the right box, along with character counts.",
        "Note the chip naming the JavaScript function in use, so you can reproduce the result in code.",
        "When decoding, fix any malformed percent sequence flagged in the error message under the input.",
        "Click Copy to grab the result, Swap to move it back into the input with the mode flipped, or Clear to reset.",
      ],
      features: [
        "Component mode powered by encodeURIComponent and decodeURIComponent",
        "Full URL mode powered by encodeURI and decodeURI, preserving URL structure",
        "Correct UTF-8 percent-encoding for accented characters, CJK scripts and emoji",
        "Live output with character counts for input and output",
        "Clear errors for malformed percent sequences instead of silent corruption",
        "Shows the exact JavaScript function used",
        "100% client-side with no data sent to any server",
      ],
      faq: [
        {
          question: "What is the difference between encodeURIComponent and encodeURI?",
          answer:
            "encodeURIComponent escapes every character except letters, digits and - _ . ! ~ * ' ( ). Use it for a single piece of a URL such as a query value; it encodes / ? & = and # because those would change the URL's structure. encodeURI is meant for a whole URL: it keeps those reserved characters and only escapes characters that are never legal in a URL, such as spaces.",
        },
        {
          question: "Why is a space encoded as %20 and not +?",
          answer:
            "The percent-encoding standard, RFC 3986, represents a space as %20. The + convention comes from the older application/x-www-form-urlencoded format used by HTML forms, where + means a space in the query string. encodeURIComponent follows RFC 3986, so it produces %20. If a form body expects +, replace %20 after encoding, or use URLSearchParams, which does this for you.",
        },
        {
          question: "Why do I get a URI malformed error when decoding?",
          answer:
            "decodeURIComponent throws when a % sign is not followed by two hexadecimal digits, or when the decoded bytes do not form valid UTF-8. Common causes are a literal % that was never encoded, such as 50% off, a string truncated in the middle of an escape, or data encoded with a legacy charset. Encode the stray % as %25 and try again.",
        },
        {
          question: "How do I fix a URL that has been encoded twice?",
          answer:
            "Double encoding turns every % into %25, so %20 becomes %2520 and the server sees a literal %20 instead of a space. If you spot %25 in a URL, decode it here repeatedly until the string stops changing, then find the place in your code that encodes an already-encoded value. Encode exactly once, where the raw value is inserted into the URL.",
        },
        {
          question: "Does this tool handle emoji and non-Latin characters?",
          answer:
            "Yes. The JavaScript encoding functions convert the text to UTF-8 first, so each non-ASCII character becomes a sequence of two to four %XX escapes. The letter e with an acute accent becomes %C3%A9 and most emoji become four escapes such as %F0%9F%98%80. Decoding reverses the process.",
        },
        {
          question: "Which characters do not need to be URL encoded?",
          answer:
            "RFC 3986 defines the unreserved set as letters, digits and the four symbols - _ . ~; these are always safe anywhere in a URL. encodeURIComponent also leaves ! * ' ( ) untouched for historical reasons. Everything else, including space, quotes, non-ASCII characters and delimiters such as / ? # & = +, must be escaped inside a value.",
        },
        {
          question: "Is URL encoding the same as HTML encoding or Base64?",
          answer:
            "No, they solve different problems. URL encoding makes text safe inside a URL using %XX escapes. HTML encoding makes text safe inside markup using entities such as &amp; and &lt;. Base64 turns arbitrary bytes into printable ASCII for transport. A Base64 string containing + and / must still be percent-encoded before it goes into a URL.",
        },
      ],
    },
  },
};
