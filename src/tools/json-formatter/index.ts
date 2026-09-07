import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const jsonFormatter: ToolDefinition = {
  slug: "json-formatter",
  category: "developer",
  name: "JSON Formatter",
  shortDescription: "Free JSON formatter and validator: beautify, minify and fix errors fast.",
  keywords: [
    "json formatter",
    "json validator",
    "format json online",
    "json beautifier",
    "pretty print json",
    "minify json",
    "json lint",
    "json pretty print",
    "json parser online",
    "validate json free",
    "json viewer",
    "fix json error",
    "json prettifier",
  ],
  related: ["base64", "url-encoder", "jwt-decoder"],
  icon: "{ }",
  popular: true,
  component: Tool,
  content: {
    en: {
      title: "JSON Formatter, Validator & Beautifier Online",
      description:
        "Free JSON formatter and validator. Pretty print with 2 or 4 spaces, sort keys, minify, and jump straight to parse errors. Runs in your browser, no upload.",
      intro: [
        "This free JSON formatter and validator turns a compressed or messy JSON string into cleanly indented text in one click, and tells you exactly where the document breaks when it is invalid. Paste an API response, a config file or a log line, choose two spaces, four spaces or tabs, and the tool pretty prints the result with an accurate byte, line and key count. It is built for developers, QA engineers and anyone who reads JSON by eye. Everything runs client-side in your browser with the standard JSON.parse and JSON.stringify APIs, so production payloads and tokens never leave your machine.",
        "Use it when a minified response from curl or a browser network tab is unreadable, when a hand-edited config file refuses to load, or when you need to diff two payloads and want the keys in a stable order. The error message includes the line and column reported by the parser, and a Jump to line button moves the cursor straight to the problem so you are not hunting through a wall of text.",
        "Compared with an IDE extension or a command-line tool such as jq, this page needs no install and works on a locked-down machine or a phone. Format on paste is on by default, so the result is usually ready before you reach for a button, and Ctrl+Enter reformats after edits.",
      ],
      howTo: [
        "Paste or type JSON into the Input box. With Format on paste ticked, pasted text is formatted immediately.",
        "Pick an indent from the Indent dropdown: 2 spaces, 4 spaces or Tab.",
        "Tick Sort keys to order every object's keys alphabetically, including nested objects.",
        "Click Format (or press Ctrl+Enter) for readable output, or Minify to strip all whitespace for transport.",
        "If the document is invalid, read the error under the Input box and click Jump to line to move the cursor to the problem.",
        "Click Copy to copy the Output, Use as input to keep editing the result, or Clear to start over.",
      ],
      features: [
        "Validation with the parser's own message plus line and column",
        "Jump to line button that places the cursor on the error",
        "Pretty print with 2 spaces, 4 spaces or tabs",
        "Minify to the smallest valid representation",
        "Recursive key sorting for stable diffs",
        "Format on paste and a Ctrl+Enter shortcut",
        "Byte, line and key count of the output",
        "100% client-side, works offline once loaded",
      ],
      faq: [
        {
          question: "Is my JSON uploaded to a server?",
          answer:
            "No. Formatting runs entirely in your browser using the built-in JSON.parse and JSON.stringify functions, and the page makes no network request with your data. You can disconnect from the internet after the page loads and the formatter keeps working, which makes it safe for API keys, customer records and other production payloads.",
        },
        {
          question: "Why does the validator say my JSON is invalid?",
          answer:
            "The usual causes are a trailing comma after the last item, single quotes instead of double quotes, unquoted keys, comments, or values such as NaN and undefined. Strict JSON allows none of these. The error message shows the line and column where parsing stopped, and Jump to line takes you there. Fix that spot and re-run Format.",
        },
        {
          question: "What is the difference between formatting and minifying JSON?",
          answer:
            "Formatting, also called beautifying or pretty printing, adds line breaks and indentation so humans can read the structure. Minifying removes every optional whitespace character to produce the smallest payload for network transfer or storage. Both operations keep the data identical; only the whitespace changes, and either output parses back to the same object.",
        },
        {
          question: "Does sorting keys change the meaning of the data?",
          answer:
            "No. The JSON specification defines objects as unordered collections of name and value pairs, so a document with sorted keys is equivalent to the original. Sorting is useful when you want to compare two payloads in a diff tool, produce deterministic output for version control, or find a key quickly in a large object. Array order is never changed.",
        },
        {
          question: "How is this different from Prettier or the jq command line?",
          answer:
            "Prettier and jq are excellent when you have a terminal or an editor open, but both need installing and configuring. This page does the common cases, indent, minify, sort and validate, with nothing to set up, and it points at the exact parse error. For scripted pipelines or formatting hundreds of files, a command-line tool is still the right choice.",
        },
        {
          question: "Can it format JSON with comments or trailing commas?",
          answer:
            "No. The formatter follows the strict JSON grammar, so JSON5, JSONC and other relaxed dialects with comments or trailing commas are reported as errors. Remove the comments or trailing commas first, or run the file through a JSON5 parser that emits plain JSON. The advantage of strictness is that anything this tool accepts will be accepted by every JSON parser.",
        },
        {
          question: "Is there a size limit?",
          answer:
            "The only limit is your browser's memory. Documents of several megabytes format in well under a second on a modern laptop, and the output panel shows the byte size and line count so you can judge what you are pasting into a ticket or a chat. Files of hundreds of megabytes are better handled with a streaming command-line tool.",
        },
      ],
    },
  },
};
