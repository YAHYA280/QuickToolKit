import type { ToolDefinition } from "../types";

export const htmlEntityEncoder: ToolDefinition = {
  slug: "html-entity-encoder",
  category: "developer",
  name: "HTML Entity Encoder / Decoder",
  shortDescription: "Free HTML entity encoder and decoder for special and accented characters.",
  keywords: [
    "html entity encoder",
    "html entity decoder",
    "html escape",
    "html unescape",
    "encode html entities",
    "decode html entities",
    "html special characters",
    "escape html online",
    "html entities list",
    "named html entities",
    "html character codes",
    "convert text to html entities",
  ],
  related: ["url-encoder", "base64", "markdown-editor"],
  icon: "&;",
  popular: false,
  content: {
    en: {
      title: "HTML Entity Encoder & Decoder: Escape HTML Online",
      description:
        "Free HTML entity encoder and decoder. Escape & < > quotes and accented letters as named, decimal or hex entities, or decode entities back to plain text.",
      intro: [
        "This HTML entity encoder and decoder converts characters that have a special meaning in HTML, such as the ampersand, angle brackets and quotes, into safe entity references like &amp;, &lt; and &quot;, and turns entities back into readable text. Choose named entities where one exists, decimal references such as &#233; or hexadecimal references such as &#xE9;, and decide whether to escape only the five reserved characters or every non-ASCII character. The conversion runs in your browser with a small lookup table and a pure string function, so the snippet you paste is never sent to a server.",
        "Encode when you need to show literal HTML source inside a web page, embed user-supplied text in an attribute, or make sure an accented name survives a page served with the wrong character set. Decode when an API, a scraped page or an RSS feed hands you text full of &#39; and &nbsp; and you want to read or process the real characters.",
        "A reference table under the tool lists the most common entities with the character, named form, decimal code and hex code, so you can look one up without converting anything. Counters show how many characters went in, how many came out and how many entities were written or resolved.",
      ],
      howTo: [
        "Choose Encode or Decode with the switch at the top of the tool.",
        "Paste your text or HTML into the input box. The output box updates as you type.",
        "When encoding, pick a style from the Format dropdown: named where possible, numeric decimal or hex.",
        "Tick Only encode & < > \" ' to escape just the reserved characters, or leave it unticked to convert every non-ASCII character such as é, © or the euro sign too.",
        "Read the Input chars, Output chars and Entities counters to confirm how many characters were converted.",
        "Click Copy to copy the result, or Swap to move the output into the input and reverse the direction.",
      ],
      features: [
        "Encode to named, decimal or hexadecimal entities",
        "Minimal mode for the five reserved HTML characters",
        "Full mode that escapes every non-ASCII character",
        "Decode named, decimal and hex references in one pass",
        "Lookup table of 150+ named entities including Latin-1 and Greek letters",
        "Live output with copy and swap buttons",
        "Character and entity counters",
        "Pure client-side conversion, no innerHTML and no upload",
      ],
      faq: [
        {
          question: "What is an HTML entity?",
          answer:
            "An HTML entity is a sequence that starts with an ampersand and ends with a semicolon and stands in for a single character. Named entities such as &copy; use a mnemonic, decimal entities such as &#169; use the Unicode code point in base ten, and hex entities such as &#xA9; use base sixteen. Browsers render the character in its place, which lets you show characters that would otherwise be parsed as markup.",
        },
        {
          question: "Which characters must always be escaped in HTML?",
          answer:
            "Five characters are reserved. The ampersand starts an entity, the less-than sign opens a tag and the greater-than sign closes one, so &, < and > must be escaped in text content. Double and single quotes must be escaped inside attribute values that use the same quote character. Everything else, including accented letters, is optional as long as the page declares UTF-8 encoding.",
        },
        {
          question: "Should I use named, decimal or hex entities?",
          answer:
            "All three render identically in modern browsers. Named entities are easiest for humans to read but only exist for a fixed list of characters, and some XML tools reject names other than the five XML built-ins. Decimal and hex references work for any code point and are the safest choice in XML, RSS and SVG. Hex is common in JavaScript and CSS contexts because it matches Unicode notation.",
        },
        {
          question: "Do I need to encode accented characters like é?",
          answer:
            "Not if your page is served as UTF-8, which is the default for HTML5 and every modern framework. Encoding accented letters is still useful when a legacy system stores or serves content in Latin-1 or Windows-1252, when an email template passes through an unknown pipeline, or when you paste into a tool that strips non-ASCII bytes. Leave the minimal option unticked to encode them.",
        },
        {
          question: "Is decoding done with innerHTML?",
          answer:
            "No. Decoding is a pure string function that matches named, decimal and hexadecimal references with a regular expression and replaces each one with the corresponding character from a built-in table. Nothing is inserted into the page as markup, so a pasted script tag can never execute, and the tool behaves the same in every browser. Unknown names are left unchanged rather than guessed.",
        },
        {
          question: "Why do I see &amp; inside decoded text?",
          answer:
            "That is double encoding. Somewhere in a pipeline the text was escaped twice, so the original & became &amp; and then &amp;amp;. One decode pass turns &amp;amp; into &amp;, and a second pass gives you the plain ampersand. Click Swap after decoding to run the result through the decoder again, then fix the pipeline so content is escaped exactly once, at output time.",
        },
        {
          question: "What is the difference between HTML entity encoding and URL encoding?",
          answer:
            "HTML entity encoding protects characters that HTML would interpret as markup, using the ampersand and semicolon syntax. URL encoding, also called percent encoding, protects characters that are not allowed in a URL by replacing each byte with a percent sign and two hex digits, so a space becomes %20. They apply in different places: entities inside HTML text and attributes, percent encoding inside query strings and paths.",
        },
      ],
    },
  },
};
