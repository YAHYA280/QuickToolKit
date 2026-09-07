import type { ToolDefinition } from "../types";

export const passwordGenerator: ToolDefinition = {
  slug: "password-generator",
  category: "text",
  name: "Password Generator",
  shortDescription: "Strong password generator and passphrase generator that runs in your browser.",
  keywords: [
    "password generator",
    "strong password generator",
    "random password generator",
    "secure password generator",
    "passphrase generator",
    "random passphrase",
    "password strength checker",
    "generate password online",
    "password entropy",
    "diceware",
    "long password generator",
    "password ideas",
    "random string generator",
    "password creator",
  ],
  related: ["uuid-generator", "hash-generator", "case-converter"],
  icon: "***",
  popular: true,
  content: {
    en: {
      title: "Strong Random Password Generator & Passphrases",
      description:
        "Free password generator: strong random passwords or memorable passphrases from a cryptographic RNG in your browser. Set length and symbols, see entropy.",
      intro: [
        "This password generator creates strong random passwords using your browser's cryptographic random number generator, crypto.getRandomValues, the same source of randomness that password managers rely on. Choose a length from 4 to 128 characters, pick which character sets to include, optionally drop look-alike characters such as 0, O, 1, l and I, and generate up to twenty passwords at once. Every password is guaranteed to contain at least one character from each enabled set. It is meant for anyone setting up a new account, a Wi-Fi network or a database user. Generation runs client-side in your browser, so no password is ever transmitted, stored or logged.",
        "Switch to Passphrase mode to build a memorable password from three to eight random words joined by a hyphen, space, underscore or period, with optional capitalization and a trailing two-digit number. A strength meter shows the estimated entropy in bits for the current settings, so you can compare a short complex password against a long simple one before you pick.",
        "Use it whenever a site asks for a password you will store in a manager, or when you need a master password you must actually remember, where a passphrase wins. Characters are drawn with rejection sampling rather than a modulo operation, so no character is favoured over another.",
      ],
      howTo: [
        "Choose Password for random characters or Passphrase for random words.",
        "Set Length with the slider or the number box (4 to 128), or in passphrase mode set Words (3-8) and a Separator.",
        "Tick Lowercase, Uppercase, Digits and Symbols as required, and optionally Exclude ambiguous; for passphrases, tick Capitalize words or Append a number.",
        "Set How many passwords to produce (1 to 20). Results refresh whenever an option changes, or click Generate for a new batch.",
        "Check the Strength meter and its bit count before choosing one.",
        "Click Copy next to a single password or Copy all for the whole list, then save it in a password manager.",
      ],
      features: [
        "Cryptographically secure randomness with unbiased rejection sampling",
        "Every enabled character set is guaranteed to appear at least once",
        "Option to exclude ambiguous look-alike characters (0, O, 1, l, I, |)",
        "Passphrase mode with a 300-word list, five separators, capitalization and a number",
        "Entropy-based strength meter measured in bits",
        "Batch generation of up to 20 passwords, each with its own Copy button",
        "Generated locally in the browser, never transmitted or stored",
      ],
      faq: [
        {
          question: "What is a good password length in 2026?",
          answer:
            "For a random password stored in a manager, 16 characters or more from all four character sets gives over 100 bits of entropy, far beyond what offline cracking can reach. For a passphrase you must remember, use at least five or six random words. Current NIST guidance favours length over forced complexity rules and asks services to accept at least 64 characters.",
        },
        {
          question: "How is password strength measured?",
          answer:
            "The meter estimates entropy in bits: length multiplied by log2 of the character pool size. A 12-character password drawn from 94 characters has about 79 bits; a 16-character one has about 105 bits. Each extra bit doubles the number of guesses an attacker needs, so 80 bits or more is considered very strong against offline brute-force attacks.",
        },
        {
          question: "Is a longer password better than a more complex one?",
          answer:
            "Usually yes. Adding symbols raises the pool from 62 to 94 characters, worth only about 0.6 bits per character, while each additional character adds around 6 bits. Going from 10 to 14 characters therefore does more for security than adding symbols to a 10-character password. Length is the most reliable way to increase strength.",
        },
        {
          question: "Are passphrases secure?",
          answer:
            "Yes, when the words are chosen randomly rather than by you. Four words from this 300-word list give about 33 bits, six words about 49 bits and eight words about 66 bits; the appended number adds another 6.6 bits. Passphrases are easier to type and remember than a string of symbols, which makes them a good choice for master passwords you must recall.",
        },
        {
          question: "Are the passwords generated on a server?",
          answer:
            "No. Passwords are generated locally in your browser with the Web Crypto API. Nothing is sent over the network, no history is kept and closing the tab discards everything. You can verify this by disconnecting from the internet and generating again; the page keeps working because no server is involved.",
        },
        {
          question: "Why does the strength meter show Weak or Fair?",
          answer:
            "The label depends only on entropy: under 40 bits is Weak, 40 to 60 Fair, 60 to 80 Strong and 80 or more Very strong. A short length or a single character set keeps the figure low, and a three-word passphrase scores about 25 bits. Increase Length, enable more character sets, or add words and a number until the meter reads Strong.",
        },
        {
          question: "Do I still need a password manager if I use a generator?",
          answer:
            "Yes. A generator solves creating a strong, unique password; a manager solves remembering hundreds of them and filling them in without typos or phishing risk. Generate a password here, paste it into the site and into your manager, and reuse nothing across sites. Keep one memorable passphrase for the manager itself and enable two-factor authentication where offered.",
        },
      ],
    },
  },
};
