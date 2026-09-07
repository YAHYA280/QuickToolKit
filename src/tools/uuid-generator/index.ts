import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const uuidGenerator: ToolDefinition = {
  slug: "uuid-generator",
  category: "developer",
  name: "UUID Generator",
  shortDescription: "UUID generator for random v4 UUIDs and GUIDs, one at a time or 1000 in bulk.",
  keywords: [
    "uuid generator",
    "guid generator",
    "generate uuid",
    "uuid v4",
    "random uuid",
    "bulk uuid generator",
    "uuid online",
    "unique id generator",
    "guid online",
    "randomuuid",
    "uuid without hyphens",
    "uuid list",
    "generate guid",
  ],
  related: ["password-generator", "hash-generator", "base64"],
  icon: "id",
  component: Tool,
  content: {
    en: {
      title: "UUID Generator Online: Random v4 UUIDs & GUIDs",
      description:
        "Free UUID generator: create 1 to 1000 random version 4 UUIDs (GUIDs) with the browser's crypto API. Uppercase, no-hyphen and quoted formats, no upload.",
      intro: [
        "This UUID generator creates random version 4 UUIDs, also called GUIDs, either one at a time with a single click or up to a thousand in a batch. A UUID is a 128-bit identifier written as 32 hexadecimal digits in five hyphen-separated groups, for example 3f2504e0-4f89-41d3-9a0c-0305e82c3301. Version 4 values are drawn from random numbers, which makes them a good fit for database primary keys, request and trace IDs, file names and test fixtures where identifiers must not collide without a central authority handing them out. Generation runs client-side in your browser with the Web Crypto API, so nothing is requested from or sent to a server.",
        "The page uses crypto.randomUUID, which draws from the operating system's cryptographically secure random source, and falls back to crypto.getRandomValues with the correct version and variant bits set when the newer API is unavailable. Formatting options let you switch to uppercase, remove the hyphens for the compact 32-character form, or wrap each value in double quotes so a list can be pasted straight into JSON, SQL or a test file.",
        "It replaces reaching for uuidgen or a language snippet when you only need a handful of IDs for a seed script, a Postman request or a spreadsheet. Output is one UUID per line, which pastes cleanly into an editor or a CSV.",
      ],
      howTo: [
        "Click the large UUID in the Quick copy box to copy it, or press New for a fresh one.",
        "For a batch, set Count to the number you need, from 1 to 1000.",
        "Tick Uppercase, Remove hyphens or Wrap in quotes; the formatting applies to the quick copy value and the list.",
        "Click Generate to fill the Generated UUIDs box, one per line.",
        "Click Copy to copy the whole list to your clipboard.",
        "Click Clear to empty the list and start again.",
      ],
      features: [
        "Cryptographically secure version 4 UUIDs via crypto.randomUUID",
        "Bulk generation of up to 1000 IDs at once",
        "Uppercase, hyphen-free and quoted output formats",
        "One-click quick copy for a single UUID",
        "Output one per line for easy pasting into spreadsheets, scripts and fixtures",
        "Fallback to crypto.getRandomValues with correct version and variant bits",
        "Works offline and never sends data anywhere",
      ],
      faq: [
        {
          question: "Are the generated UUIDs truly unique?",
          answer:
            "A version 4 UUID contains 122 random bits, giving about 5.3 x 10^36 possible values. You would need to generate billions of UUIDs per second for centuries before a collision became likely, so in practice they can be treated as unique without any coordination, which is why databases and distributed systems rely on them.",
        },
        {
          question: "What is the difference between a UUID and a GUID?",
          answer:
            "They are the same 128-bit format. GUID, for globally unique identifier, is the name Microsoft uses in Windows, .NET and SQL Server, while UUID is the term used in the RFC 9562 standard and most other platforms. Both are written as 32 hex digits in the 8-4-4-4-12 pattern and are fully interchangeable.",
        },
        {
          question: "What do the 4 and the 8, 9, a or b in a UUID mean?",
          answer:
            "The first digit of the third group is the version number, so version 4 UUIDs always have a 4 there. The first digit of the fourth group encodes the variant and is always 8, 9, a or b for RFC-style UUIDs. These six fixed bits are why a v4 UUID has 122 random bits rather than 128, and they let a parser tell a random UUID from a time-based one at a glance.",
        },
        {
          question: "Should I use UUID v4 or v7 for database primary keys?",
          answer:
            "Version 7, defined in RFC 9562, starts with a millisecond timestamp so new IDs sort roughly in creation order, which keeps B-tree indexes compact on large tables. Version 4 is fully random, which is ideal when IDs must not reveal creation time or ordering. This tool generates v4; most modern UUID libraries now provide v7 as well.",
        },
        {
          question: "Is it safe to use these UUIDs for security tokens?",
          answer:
            "crypto.randomUUID and crypto.getRandomValues use the operating system's cryptographically secure random number generator, so the values are unpredictable and cannot be guessed from earlier ones. They are fine as session identifiers or one-time links, but they are not a substitute for a signed token such as a JWT when you need expiry, claims or revocation.",
        },
        {
          question: "Should I store UUIDs with or without hyphens?",
          answer:
            "Hyphens are only formatting. Most databases have a native UUID type that stores the 16 raw bytes however you write it, and PostgreSQL accepts input with or without hyphens. If you store UUIDs as text, pick one format and stick with it so equality comparisons and indexes work. Remove hyphens produces the compact 32-character form used by some APIs and file naming schemes.",
        },
        {
          question: "Why does the quick copy show Generating or fail to copy?",
          answer:
            "The quick copy value is produced after the page loads, so on a slow connection it can read Generating for a moment; click New if it does not fill in. If clicking does not copy, your browser may block the Clipboard API outside HTTPS or inside an embedded frame. Click Generate, then select the text in the Generated UUIDs box and copy it manually.",
        },
      ],
    },
  },
};
