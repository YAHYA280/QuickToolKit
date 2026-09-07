import type { ToolDefinition } from "../types";

export const caseConverter: ToolDefinition = {
  slug: "case-converter",
  category: "text",
  name: "Case Converter",
  shortDescription: "Case converter: upper, lower, title, sentence, camel, snake, kebab and more.",
  keywords: [
    "case converter",
    "uppercase to lowercase",
    "lowercase to uppercase",
    "title case converter",
    "sentence case converter",
    "camelcase converter",
    "snake case converter",
    "kebab case",
    "pascalcase",
    "capitalize words",
    "change text case online",
    "text case converter",
    "constant case",
    "convert case",
  ],
  related: ["word-counter", "url-encoder", "regex-tester"],
  icon: "aA",
  content: {
    en: {
      title: "Case Converter: Uppercase to Lowercase, Title Case",
      description:
        "Free case converter: change text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case in one click, in your browser.",
      intro: [
        "This case converter changes the capitalization of any text in one click. Paste a heading, a sentence, a list of variable names or a whole paragraph and switch between UPPERCASE, lowercase, Title Case and Sentence case for writing, or camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE for code. The programming styles first split your input on spaces, underscores, hyphens and existing camelCase boundaries, so userFirstName, user_first_name and user-first-name all convert cleanly to any other style. Writers fixing a headline, developers renaming identifiers and marketers preparing URL slugs all use it. Conversion runs client-side in your browser and the text is never uploaded, logged or stored.",
        "Each line is converted independently, which makes the tool handy for batch-renaming a list of identifiers, fixing the capitalization of a set of titles or generating slugs for a dozen blog posts in one pass. Title Case keeps short words such as a, of and the in lowercase unless they begin the line, following the convention of most style guides, and an aLtErNaTiNg style is included for the occasional meme.",
        "Compared with the transform commands in an editor or a spreadsheet's UPPER and PROPER functions, this page handles the programming cases that those tools lack, and the Use output as input button lets you chain conversions, for example Title Case followed by kebab-case to build a clean URL slug.",
      ],
      howTo: [
        "Paste or type into the Input text box. Multi-line text is supported and each line is handled separately.",
        "Click a case button: UPPERCASE, lowercase, Title Case or Sentence case for prose, or camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE or aLtErNaTiNg.",
        "Read the result in the Output box, which names the active style and updates live while you keep editing the input.",
        "Check the character and word count shown at the bottom right.",
        "Click Copy to put the result on your clipboard.",
        "Click Use output as input to chain conversions, or Clear to start over.",
      ],
      features: [
        "Ten case styles from UPPERCASE to CONSTANT_CASE and aLtErNaTiNg",
        "Smart word splitting on spaces, underscores, hyphens and camelCase boundaries",
        "Title Case keeps short words like a, of and the in lowercase",
        "Line-by-line conversion for lists of identifiers or headings",
        "Live output that follows your edits",
        "Copy the result or feed it back as input in one click",
        "Works offline once loaded; nothing is sent to a server",
      ],
      faq: [
        {
          question: "When should I use camelCase versus snake_case?",
          answer:
            "Follow the language's style guide. JavaScript, TypeScript, Java, Swift and Kotlin use camelCase for variables and functions and PascalCase for classes and types. Python, Ruby, Rust and most SQL schemas use snake_case for variables, functions and column names, and CONSTANT_CASE for constants. Apply the convention of the codebase you are in consistently; mixing styles is worse than either choice.",
        },
        {
          question: "What is the difference between Title Case and Sentence case?",
          answer:
            "Title Case capitalizes the first letter of every significant word, as in a book or article headline, while leaving short function words such as a, an, the, of and and in lowercase unless they start the title. Sentence case capitalizes only the first word of each sentence and leaves the rest lowercase, which is what most web style guides now recommend for headings and buttons.",
        },
        {
          question: "How does the tool split words for the programming cases?",
          answer:
            "It breaks the input at spaces, underscores, hyphens, and at the boundary between a lowercase letter or digit and an uppercase letter, so myVariableName becomes my, Variable and Name. Runs of capitals such as HTMLParser split into HTML and Parser. Punctuation is dropped so the result is a valid identifier, and the pieces are then joined and capitalized according to the style you chose.",
        },
        {
          question: "What is kebab-case used for?",
          answer:
            "Kebab-case joins lowercase words with hyphens. It is the standard style for URL slugs, CSS class names, HTML attributes, file names and command-line flags, because hyphens are safe in those contexts and search engines treat them as word separators. To make a slug from a title, paste the title, click kebab-case, and remove any stray punctuation words by hand.",
        },
        {
          question: "Why did my acronym or number come out differently than expected?",
          answer:
            "The programming cases lowercase every piece before rebuilding, so HTMLParser becomes htmlParser in camelCase and html_parser in snake_case; the acronym is not preserved in capitals. A digit followed by a capital letter is also treated as a word boundary, so version2Beta splits into version2 and Beta. If an acronym must stay uppercase, fix that one word after converting.",
        },
        {
          question: "Can I change case in Excel or Word instead?",
          answer:
            "Yes, for the writing styles. Excel and Google Sheets offer UPPER, LOWER and PROPER, though PROPER capitalizes every word and the letter after an apostrophe, turning don't into Don'T. Word cycles through cases with Shift+F3. None of them produce camelCase, snake_case or kebab-case, which is where this converter fits in.",
        },
        {
          question: "Is my text sent to a server?",
          answer:
            "No. The conversion happens entirely in your browser with a few lines of JavaScript, so nothing is uploaded, logged or stored, and it is safe for drafts, keys in config files or unpublished content. Once the page has loaded it even works with your internet connection switched off.",
        },
      ],
    },
  },
};
