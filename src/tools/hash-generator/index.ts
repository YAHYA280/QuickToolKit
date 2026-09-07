import type { ToolDefinition } from "../types";
import Tool from "./Tool";

export const hashGenerator: ToolDefinition = {
  slug: "hash-generator",
  category: "developer",
  name: "Hash Generator",
  shortDescription: "Hash generator for MD5, SHA-1, SHA-256, SHA-384 and SHA-512 digests of text.",
  keywords: [
    "hash generator",
    "md5 generator",
    "sha256 generator",
    "sha256 hash online",
    "md5 hash online",
    "sha1 hash",
    "sha512 hash",
    "sha384",
    "checksum calculator",
    "hash calculator",
    "text to hash",
    "md5 vs sha256",
    "digest",
    "hash string online",
  ],
  related: ["base64", "jwt-decoder", "uuid-generator"],
  icon: "#",
  component: Tool,
  content: {
    en: {
      title: "MD5 & SHA256 Hash Generator Online: SHA-1, SHA-512",
      description:
        "Free hash generator: MD5, SHA-1, SHA-256, SHA-384 and SHA-512 checksums of any text, computed instantly with Web Crypto in your browser. Nothing uploaded.",
      intro: [
        "This hash generator computes the MD5, SHA-1, SHA-256, SHA-384 and SHA-512 digests of any text at the same time, updating as you type. A hash is a fixed-length fingerprint of its input: change a single character and the whole digest changes, which is why hashes verify downloads, detect accidental corruption, deduplicate files and build cache keys. Developers, system administrators and security students use it to compare a checksum, generate a test vector or check what a library should return. The SHA family runs client-side through the Web Crypto API in your browser, and MD5 is computed by a small JavaScript implementation, so nothing you enter is uploaded.",
        "Each digest is shown as lowercase hexadecimal with its bit length and its own Copy button, and a single checkbox switches every result to uppercase to match the style of a published checksum file. The input is hashed exactly as typed, encoded as UTF-8 with no trailing newline, and the character and byte counts under the box make it obvious when multi-byte characters are involved.",
        "It is a quicker alternative to sha256sum or certutil when you are on a machine without those tools or just want to hash a short string, and it covers the algorithms most APIs and download pages ask for. MD5 and SHA-1 are included for compatibility, not for new security designs.",
      ],
      howTo: [
        "Type or paste the text you want to hash into the Input text box. The digests update as you type.",
        "Check the character and UTF-8 byte count under the box to confirm exactly what is being hashed.",
        "Read the MD5, SHA-1, SHA-256, SHA-384 and SHA-512 results in the list; each row shows the algorithm and its bit length.",
        "Tick Uppercase hex if you need capital letters, for example to match a checksum published in that style.",
        "Click Copy next to any digest to place it on your clipboard.",
        "To verify a download, compare the digest with the published value; it must match exactly. Click Clear to start over.",
      ],
      features: [
        "Five algorithms computed simultaneously: MD5, SHA-1, SHA-256, SHA-384 and SHA-512",
        "Live results as you type, no button to press",
        "Lowercase or uppercase hexadecimal output",
        "One-click copy for each digest",
        "Character and UTF-8 byte count of the input",
        "Bit length shown for every algorithm",
        "SHA digests via the Web Crypto API, 100% client-side",
      ],
      faq: [
        {
          question: "MD5 vs SHA-256: which should I use?",
          answer:
            "SHA-256 for anything new. It is fast, universally supported and has no known practical weaknesses, which is why TLS certificates and most package registries use it. MD5 is only appropriate when an existing system, file format or API insists on it, for example legacy checksum files. SHA-384 and SHA-512 are fine alternatives and slightly faster on 64-bit hardware.",
        },
        {
          question: "Are MD5 and SHA-1 still safe to use?",
          answer:
            "Not for security. Practical collision attacks exist for both: researchers have produced pairs of different files with the same MD5 digest since 2004 and the same SHA-1 digest since 2017. They must not be used for signatures, certificates or password storage. They remain acceptable for non-adversarial uses such as detecting accidental corruption, cache keys and deduplication.",
        },
        {
          question: "Can I use this tool to hash passwords?",
          answer:
            "You should not store passwords as plain MD5 or SHA hashes. These functions are designed to be fast, which makes brute-force guessing cheap on a GPU. Password storage needs a slow, salted algorithm such as bcrypt, scrypt or Argon2, which this tool does not implement. It is fine for checking what a legacy system stored, but not for building a new login flow.",
        },
        {
          question: "Why does my hash differ from another tool or the command line?",
          answer:
            "The most common reasons are a trailing newline, Windows versus Unix line endings, invisible whitespace, or a different text encoding. This tool hashes the exact characters in the box encoded as UTF-8 with no added newline. Command-line tools such as echo append a newline unless you pass -n, and a file saved as UTF-16 or with a byte order mark hashes differently.",
        },
        {
          question: "Is a hash reversible?",
          answer:
            "No. A cryptographic hash is a one-way function: you cannot recover the original text from its digest. What attackers can do is guess inputs and compare digests, which is why short or common strings are effectively recoverable through precomputed lookup tables. Hashing is not encryption; if you need to get the data back, encrypt it instead.",
        },
        {
          question: "Why does the page say Web Crypto is unavailable?",
          answer:
            "The SHA digests are computed with crypto.subtle, which browsers expose only in a secure context: a page served over HTTPS or from localhost. If you open the site over plain HTTP, through some proxies or inside an unusual embedded view, the SHA rows stay empty and this message appears. MD5 still works because it is implemented in plain JavaScript. Reload the page over HTTPS.",
        },
        {
          question: "Why is MD5 not part of the Web Crypto API?",
          answer:
            "The Web Crypto API deliberately supports only SHA-1, SHA-256, SHA-384 and SHA-512 for digests, because MD5 is cryptographically broken and browser vendors did not want to encourage its use. This page therefore computes MD5 with a small, well-tested JavaScript implementation running in your browser. The result is identical to md5sum or any other standard implementation.",
        },
      ],
    },
  },
};
