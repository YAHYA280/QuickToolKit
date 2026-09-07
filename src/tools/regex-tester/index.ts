import type { ToolDefinition } from "../types";

export const regexTester: ToolDefinition = {
  slug: "regex-tester",
  category: "developer",
  name: "Regex Tester",
  shortDescription: "Regex tester with live highlighting, capture groups and flags for JavaScript.",
  keywords: [
    "regex tester",
    "regex tester online",
    "regular expression tester",
    "javascript regex",
    "regex101 alternative",
    "test regex",
    "regex match",
    "regex capture group",
    "regex flags",
    "regexp",
    "regex debugger",
    "regex validator",
    "regex cheat sheet",
    "named groups regex",
  ],
  related: ["json-formatter", "case-converter", "word-counter"],
  icon: ".*",
  popular: true,
  content: {
    en: {
      title: "Regex Tester Online: Live JavaScript Regex Matches",
      description:
        "Free regex tester with live match highlighting, capture groups, named groups and g, i, m, s, u flags. Runs on the JavaScript RegExp engine in your browser.",
      intro: [
        "This regex tester runs your regular expression against sample text as you type and highlights every match, so you see what a pattern catches and what it misses. Enter a pattern, tick the flags you need, paste some text, and a table lists each match with its index, the full text and every numbered or named capture group. Syntax errors are reported with the engine's own message the moment they appear. It is aimed at JavaScript and Node.js developers, but anyone learning regular expressions will find it useful. Matching runs client-side in your browser using the native RegExp engine, so log excerpts and API responses stay on your machine.",
        "Because the page uses the same engine as Node.js and Chrome, the results are exactly what your code will produce, including lookbehind, named groups and Unicode property escapes. Zero-length matches are handled safely, the g flag is on by default, and a Quick reference of common tokens sits under the tool.",
        "Use it to check a validation pattern before shipping it, to extract fields from a log line with capture groups, or to work out why an editor search-and-replace does not match. Other languages differ slightly, so confirm advanced patterns in the target language.",
      ],
      howTo: [
        "Type your regular expression in the Pattern field, without the surrounding slashes.",
        "Tick the flags you need: g global, i ignore case, m multiline, s dotAll and u unicode.",
        "Paste or type the text to search in the Test string box.",
        "Read the Matches, Capture groups and Flags counters, then check the Highlighted preview.",
        "Open the Match details table to inspect the index, full match and capture groups for every match.",
        "Fix any syntax error shown under the Pattern field, expand Quick reference for a cheat sheet, or click Clear.",
      ],
      features: [
        "Live highlighting of every match in the test string",
        "Match table with index, full match and numbered and named capture groups",
        "Support for the g, i, m, s and u flags",
        "Immediate syntax error reporting from the JavaScript engine",
        "Safe handling of zero-length matches, capped at 1000 matches",
        "Capture group count for the current pattern",
        "Built-in quick reference for common regex tokens",
      ],
      faq: [
        {
          question: "What do the regex flags g, i, m, s and u do?",
          answer:
            "g (global) finds every match instead of stopping at the first. i makes matching case-insensitive. m (multiline) lets ^ and $ match at the start and end of each line rather than only the whole string. s (dotAll) lets the dot match newline characters, and u enables full Unicode mode so an emoji counts as one character and \\p{Letter} style property escapes work.",
        },
        {
          question: "What is the difference between greedy and lazy quantifiers?",
          answer:
            "Quantifiers like *, + and {n,m} are greedy by default: they consume as much text as possible and only give characters back if the rest of the pattern cannot match. Adding a question mark, as in .*? or +?, makes them lazy so they match as little as possible. With two quoted strings on a line, greedy .* spans both while lazy .*? stops at the first.",
        },
        {
          question: "Why does my regex match an empty string?",
          answer:
            "Patterns made only of optional parts, such as a* or \\d?, can succeed without consuming any characters, producing zero-length matches at every position. This tool advances past them automatically and shows them as (empty) in the table, but a naive exec loop in your own code would spin forever. Use + instead of *, or anchor the pattern so it must consume a character.",
        },
        {
          question: "Why does my pattern only find the first match?",
          answer:
            "The g flag is missing. Without it a JavaScript regex stops after the first match. Tick g here and use matchAll or replaceAll in code to process every occurrence. If g is on and you still see one match, an anchor such as ^ or $ may be limiting the pattern; add the m flag to apply it per line.",
        },
        {
          question: "How do I match text across multiple lines?",
          answer:
            "It depends on what you mean. If ^ and $ should match at each line break, add the m flag. If a dot should be allowed to cross line breaks, add the s flag, or use [\\s\\S] in place of the dot when you cannot change flags. To capture a block between two markers on different lines, combine s with a lazy quantifier such as START(.*?)END.",
        },
        {
          question: "How is this different from regex101?",
          answer:
            "regex101 supports several regex flavors, including PCRE, Python and Go, and offers a detailed explanation panel, which is ideal for learning. This tester is JavaScript-only and deliberately lightweight: no account, nothing saved on a server, and everything runs offline in your browser. If your pattern will run in Node.js or a browser, the results here match production exactly.",
        },
        {
          question: "Are the results the same in Python, Java or PHP?",
          answer:
            "Mostly, but not exactly. This tester uses the JavaScript engine, so lookbehind, named groups written as (?<name>) and Unicode property escapes follow ECMAScript rules. Python uses (?P<name>) for named groups, Java has its own escaping quirks inside string literals, and PHP uses PCRE with delimiters. Verify in the target language when a pattern relies on advanced features.",
        },
      ],
    },
  },
};
