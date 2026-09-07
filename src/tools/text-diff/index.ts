import type { ToolDefinition } from "../types";

export const textDiff: ToolDefinition = {
  slug: "text-diff",
  category: "text",
  name: "Text Diff Checker",
  shortDescription: "Text diff checker: compare two texts by line, word or character in your browser.",
  keywords: [
    "diff checker",
    "text compare",
    "compare two texts",
    "text difference checker",
    "diff tool online",
    "compare documents",
    "find differences between two texts",
    "code diff",
    "word diff",
    "line diff",
    "text diff",
    "online diff",
    "compare text files",
  ],
  related: ["word-counter", "json-formatter", "case-converter"],
  icon: "+-",
  popular: true,
  content: {
    en: {
      title: "Text Diff Checker: Compare Two Texts Online Free",
      description:
        "Free text diff checker. Compare two texts by line, word or character, see additions and deletions highlighted, and copy the diff. Runs in your browser.",
      intro: [
        "This free text diff checker compares two pieces of text and highlights exactly what changed between them. Paste the first version into Original and the second into Changed, and the differences appear instantly: removed lines carry a minus sign and a red tint, added lines a plus sign and a green tint, so the result is readable even without color. Switch between line, word and character granularity depending on whether you are reviewing code, prose or a single sentence. Everything runs in your browser, so contracts, source code and drafts never leave your machine.",
        "Use it to see what an editor changed in an article, to confirm that a config file on a server matches the copy in version control, or to spot the one character that differs between two URLs. Side by side aligns both texts in parallel columns, while Unified interleaves them with old and new line numbers, the format developers know from git.",
        "Ignore whitespace and Ignore case hide indentation and capitalization noise, and the similarity score shows how far two documents have drifted apart. Copy the result as a plain diff or download it as a .diff file to attach to a ticket.",
      ],
      howTo: [
        "Paste the first version into the Original box and the second version into the Changed box, or click Load sample to see a worked example.",
        "Choose a granularity: Lines for code and documents, Words for prose, or Characters for short strings such as IDs and URLs.",
        "Tick Ignore whitespace to skip indentation and spacing changes, or Ignore case to treat upper and lower case as equal.",
        "Pick Unified or Side by side in the View control. Side by side is available in Lines mode and shows both texts in aligned columns.",
        "Read the Additions, Deletions, Unchanged and Similarity stats, then scan the highlighted output. Click Swap to reverse the comparison.",
        "Click Copy unified diff to copy the result, Download .diff to save it as a file, or Clear to start over.",
      ],
      features: [
        "Line, word and character level comparison",
        "Unified view with old and new line numbers",
        "Side by side view with aligned rows",
        "Ignore whitespace and ignore case options",
        "Additions, deletions, unchanged count and similarity score",
        "Plus and minus markers, readable without color",
        "Copy the diff or download it as a .diff file",
        "100% client-side, nothing is uploaded",
      ],
      faq: [
        {
          question: "What is the difference between a line, word and character diff?",
          answer:
            "A line diff treats each line as one unit, so a single edited word marks the whole line as removed and added again, which suits code and structured files. A word diff splits text on spaces and punctuation and shows only the words that changed, which is easier to read for prose. A character diff compares every character and suits short strings such as keys or URLs.",
        },
        {
          question: "Which algorithm does this diff checker use?",
          answer:
            "The tool uses the jsdiff library, which implements the Myers diff algorithm: it finds the shortest sequence of insertions and deletions that turns the first text into the second while keeping as much shared content as possible. The same approach powers git diff and most code review tools, so the output matches what those tools show, with instant results in the browser.",
        },
        {
          question: "Why does whitespace matter when comparing code?",
          answer:
            "In many languages whitespace is part of the syntax. Python uses indentation to define blocks, YAML uses it for nesting, and Makefiles require tabs, so a change from tabs to spaces can break a file that looks identical. That is why the default comparison is strict. When only the logic matters, tick Ignore whitespace to hide spacing differences at the start and end of each line.",
        },
        {
          question: "How is the similarity percentage calculated?",
          answer:
            "The tool adds up the characters inside every unchanged segment and divides the total by the length of the longer text, rounded to a whole percent. Identical texts score 100 percent and texts with nothing in common score 0. Because unchanged segments depend on the chosen granularity, the score can shift slightly when you switch between Lines, Words and Characters or toggle the ignore options.",
        },
        {
          question: "Can I compare Word documents or PDF files?",
          answer:
            "Yes, by pasting their text. Open each document, select all, copy, and paste the content into the Original and Changed boxes. Formatting such as bold, fonts and page layout is dropped, so the comparison covers the words themselves, which is usually what you want when checking a revised contract or manuscript. Scanned PDFs need text recognition first so the text can be selected.",
        },
        {
          question: "Is a diff checker the same as a plagiarism checker?",
          answer:
            "No. A diff checker compares two specific texts that you supply and reports every insertion and deletion between them. A plagiarism checker searches one text against a large index of web pages and publications to find overlapping passages from unknown sources. Use this tool when you already have both versions, for example to see how much a rewrite still resembles the original; it does not search the internet.",
        },
        {
          question: "How do I read a unified diff?",
          answer:
            "A unified diff merges both texts into one stream. Lines starting with a minus sign exist only in the original, lines starting with a plus sign exist only in the changed version, and lines starting with a space are unchanged context. Here the two number columns on the left show the line number in the original and in the changed text, so you can locate each edit in either file.",
        },
      ],
    },
  },
};
