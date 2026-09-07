import type { ToolDefinition } from "../types";

export const wordCounter: ToolDefinition = {
  slug: "word-counter",
  category: "text",
  name: "Word Counter",
  shortDescription: "Word counter with characters, sentences, paragraphs, reading time and keywords.",
  keywords: [
    "word counter",
    "word count",
    "character counter",
    "character count",
    "count words online",
    "letter counter",
    "sentence counter",
    "paragraph counter",
    "reading time calculator",
    "essay word count",
    "twitter character count",
    "keyword density",
    "word counter free",
    "text counter",
  ],
  related: ["case-converter", "password-generator"],
  icon: "Aa",
  popular: true,
  content: {
    en: {
      title: "Word Counter & Character Counter with Reading Time",
      description:
        "Free word and character counter: count words, characters with or without spaces, sentences, paragraphs and reading time. In your browser, no sign-up.",
      intro: [
        "This word counter shows live counts of words, characters with and without spaces, sentences and paragraphs as you type or paste, along with an estimate of reading and speaking time and a list of your most frequent keywords. Students checking an essay limit, writers sizing a blog post, marketers trimming a meta description and anyone drafting a social media post can see at a glance whether the text fits. Three built-in limits for X posts, meta descriptions and Instagram captions turn red the moment you exceed them. Counting runs client-side in your browser, so drafts, cover letters and confidential documents never leave your device.",
        "Reading time uses 238 words per minute, the average adult silent reading speed reported in a 2019 meta-analysis of reading studies, and speaking time uses 150 words per minute, a comfortable presentation pace. The Top keywords list ignores common stop words and words shorter than three letters, so it surfaces the terms your text is actually about, which is a quick check of SEO focus or of a word you are overusing.",
        "Unlike the counter in a word processor, there is nothing to open or save: paste, read the numbers and leave. Counts match Microsoft Word and Google Docs for ordinary prose, and the tool works with any language and with emoji.",
      ],
      howTo: [
        "Paste or type into the Your text box; every counter updates on each keystroke.",
        "Read the Words, Characters and No spaces tiles, plus Sentences and Paragraphs.",
        "Check Reading time and Speaking time to size an article, speech or video script.",
        "Watch the X post, Meta description and Instagram caption chips; they turn red when the character count passes 280, 160 or 2,200.",
        "Scan Top keywords to see which terms repeat most, with stop words removed.",
        "Click Copy to copy your text or Clear to start a new draft.",
      ],
      features: [
        "Live word and character counts, with and without spaces",
        "Sentence and paragraph detection",
        "Reading and speaking time estimates",
        "Character limit chips for X posts, meta descriptions and Instagram captions",
        "Top keyword frequency with stop words removed",
        "Average word length",
        "Works with any language and with emoji; nothing sent to a server",
      ],
      faq: [
        {
          question: "How are words counted?",
          answer:
            "Text is split on whitespace, so anything separated by spaces, tabs or line breaks counts as one word. Hyphenated words such as well-known count as a single word, and so does a number or a URL, which matches the behaviour of Microsoft Word and Google Docs for ordinary prose. Punctuation attached to a word does not add to the word count.",
        },
        {
          question: "What counts as a character?",
          answer:
            "Every Unicode character, including spaces, punctuation, line breaks and emoji. The No spaces figure removes spaces, tabs and line breaks but keeps punctuation. Some platforms count differently: X counts most emoji as two characters and shortens links to a fixed length, so use the platform's own composer for a strict final check when you are within a few characters of the limit.",
        },
        {
          question: "How is reading time calculated?",
          answer:
            "Reading time divides the word count by 238 words per minute, the average adult silent reading speed found in a 2019 meta-analysis of 190 reading studies. Speaking time divides by 150 words per minute, a typical pace for presentations and voice-over. Technical or unfamiliar material is read more slowly, so treat both figures as estimates rather than promises.",
        },
        {
          question: "What are the character limits on social platforms?",
          answer:
            "X (formerly Twitter) posts allow 280 characters for standard accounts, Instagram captions 2,200, LinkedIn posts 3,000, and YouTube titles 100. Google typically truncates meta descriptions at around 155 to 160 characters and title tags at about 60. Paste your draft here and watch the limit chips, then confirm in the platform's own editor before publishing.",
        },
        {
          question: "Why is my word count different from Microsoft Word or Google Docs?",
          answer:
            "Small differences come from how each tool treats hyphens, slashes, dashes surrounded by spaces, and standalone punctuation. This tool counts every whitespace-separated token as a word, so a lone dash or an ellipsis on its own counts as one. Word and Docs apply their own rules, so a document can differ by a handful of words. For ordinary prose the totals agree within a fraction of a percent.",
        },
        {
          question: "How many words is a five-minute speech or a page of text?",
          answer:
            "At 150 words per minute, a five-minute speech is about 750 words and a ten-minute talk about 1,500. For pages, the usual estimate is roughly 500 words per single-spaced page and 250 per double-spaced page at 12-point type, so a 1,000-word essay runs two pages single-spaced or four double-spaced. Fonts and margins move these figures, so check your assignment's own rule.",
        },
        {
          question: "Is my text stored?",
          answer:
            "No. The text lives only in your browser tab's memory and is gone when you close or refresh the page. Nothing is sent to a server, so cover letters, contracts and unpublished manuscripts are safe to paste. If you want to keep a draft, use Copy to place it on your clipboard before you leave.",
        },
      ],
    },
  },
};
