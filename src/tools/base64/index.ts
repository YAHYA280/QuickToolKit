import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const base64Tool: ToolDefinition = {
  slug: "base64",
  category: "developer",
  name: "Base64 Encoder / Decoder",
  shortDescription: "Base64 encode or decode text online with UTF-8 and URL-safe support.",
  keywords: [
    "base64 encode",
    "base64 decode",
    "base64 encoder",
    "base64 decoder",
    "base64 online",
    "encode to base64",
    "decode base64 to text",
    "base64 url safe",
    "base64url",
    "btoa atob",
    "base64 converter",
    "base64 utf-8",
    "base64 string",
  ],
  related: ["url-encoder", "jwt-decoder", "hash-generator"],
  icon: "b64",
  popular: true,
  component: Tool,
  content: {
    en: {
      title: "Base64 Decode & Encode Online: UTF-8, URL-Safe",
      description:
        "Free Base64 encoder and decoder with full UTF-8 and URL-safe support. Live output, clear errors, nothing uploaded, runs in your browser. Paste and go.",
      intro: [
        "This Base64 encoder and decoder converts any text to Base64 and turns a Base64 string back into readable text, directly in your browser. Base64 represents binary data using 64 printable ASCII characters, which is why it appears in data URIs, email attachments, HTTP Basic auth headers, JSON payloads and every JSON Web Token. Developers use this page to inspect an encoded value from a log, prepare a header for an API call or check that a string round-trips correctly. A URL-safe switch produces the RFC 4648 variant that replaces + and / with - and _ and drops padding. Conversion happens client-side, so nothing you paste is uploaded.",
        "Unicode is handled properly. Text is converted to UTF-8 bytes with TextEncoder before btoa runs, so accented letters, CJK scripts and emoji survive the round trip, which is exactly where a naive btoa call fails. The decoder accepts input with or without padding and ignores line breaks, so a value wrapped by an email client decodes cleanly.",
        "Compared with running base64 in a terminal, the result appears as you type, errors are explained in plain language, and a Swap button feeds the output back in with the mode flipped.",
      ],
      howTo: [
        "Choose Encode to convert text to Base64, or Decode to turn Base64 back into text.",
        "Tick URL-safe alphabet if the value will go in a URL, filename or JWT; the output then uses - and _ and omits = padding.",
        "Paste or type into the left box; the result appears in the right box as you type, with a byte and character count.",
        "When decoding, read the error under the input if the string is not valid Base64.",
        "Click Copy to copy the result, or Swap to move the output into the input with the mode flipped.",
        "Click Clear to empty both boxes and start again.",
      ],
      features: [
        "Full UTF-8 support, so emoji and non-Latin scripts encode and decode correctly",
        "Standard and URL-safe (RFC 4648 section 5) alphabets",
        "Accepts input with or without padding and ignores whitespace and line breaks",
        "Live conversion with a byte and character count",
        "Plain-language errors for invalid Base64 input",
        "Swap button to chain encode and decode operations",
        "Runs completely offline in the browser, nothing is uploaded",
      ],
      faq: [
        {
          question: "Is Base64 encryption?",
          answer:
            "No. Base64 is an encoding, not encryption: it is a reversible transformation with no key, and anyone can decode it instantly with a tool like this one. Its job is to make binary data safe for text-only systems, not to hide it. If you need confidentiality, encrypt the data first and Base64 encode the ciphertext if it must travel as text.",
        },
        {
          question: "What do the = signs at the end of a Base64 string mean?",
          answer:
            "Base64 works on groups of three bytes, turning each group into four characters. When the input length is not a multiple of three, the last group is padded and one or two = characters are appended so the output length is a multiple of four. Decoders use them to know how many bytes the final group holds. This tool accepts input with or without padding.",
        },
        {
          question: "Why is the Base64 output longer than the input?",
          answer:
            "Every three bytes of input become four characters of output, so Base64 is about 33% larger than the raw data, plus up to two padding characters. This overhead is the price of representing arbitrary bytes with only 64 safe characters. Multi-byte text grows more, because an accented letter or emoji is already two to four bytes in UTF-8.",
        },
        {
          question: "What is the difference between Base64 and base64url?",
          answer:
            "They share the same idea but differ in two characters. Standard Base64 uses + and /, which have special meaning in URLs and file names. The base64url variant, defined in RFC 4648 section 5, uses - and _ instead and usually omits padding. Use it whenever the value goes in a URL, a cookie or a filename; JSON Web Tokens use it for all three segments.",
        },
        {
          question: "Why does decoding produce strange characters or replacement symbols?",
          answer:
            "The decoder assumes the bytes represent UTF-8 text. If the Base64 string actually holds binary data such as an image, a ZIP file or a certificate, or text in another encoding, the result contains garbled characters or replacement symbols. The Base64 itself is valid; the payload is simply not UTF-8 text.",
        },
        {
          question: "Can I encode a file or an image with this tool?",
          answer:
            "Not directly; the boxes accept text only. To embed an image in CSS or HTML, let your build tool create the data URI, or run the base64 command on the file and paste the result where needed. You can paste that output here to check that it is well-formed, but a binary payload will not decode to readable text.",
        },
        {
          question: "Why does btoa throw an error in my own code but this page works?",
          answer:
            "btoa only accepts strings whose characters are in the Latin-1 range, so any accented letter, CJK character or emoji makes it throw. This page first converts the text to UTF-8 bytes with TextEncoder and then encodes those bytes, which is the pattern to copy in your own code. Reverse the steps with atob and TextDecoder when decoding.",
        },
      ],
    },
  },
};
