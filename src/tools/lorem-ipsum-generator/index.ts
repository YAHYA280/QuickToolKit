import type { ToolDefinition } from "../types";

export const loremIpsumGenerator: ToolDefinition = {
  slug: "lorem-ipsum-generator",
  category: "text",
  name: "Lorem Ipsum Generator",
  shortDescription: "Lorem ipsum generator: paragraphs, sentences or words as text, HTML or Markdown.",
  keywords: [
    "lorem ipsum generator",
    "lorem ipsum",
    "placeholder text generator",
    "dummy text generator",
    "lorem ipsum paragraphs",
    "lorem ipsum html",
    "filler text",
    "lorem ipsum text",
    "random text generator",
    "lorem ipsum words",
    "lorem ipsum markdown",
    "sample text generator",
  ],
  related: ["word-counter", "case-converter", "markdown-editor"],
  icon: "Lo",
  popular: false,
  content: {
    en: {
      title: "Lorem Ipsum Generator: Paragraphs, HTML & Markdown",
      description:
        "Lorem ipsum generator for placeholder text by paragraphs, sentences or words. Output plain text, HTML paragraphs or Markdown and copy it in one click.",
      intro: [
        "This lorem ipsum generator produces placeholder text in the amount and shape you need: a number of paragraphs for a page mockup, a fixed count of sentences for a card, or an exact word count when you are testing how a headline wraps. Output it as plain text, as HTML with paragraph tags ready to drop into a template, or as Markdown for a docs site. The classic opening, Lorem ipsum dolor sit amet, can be kept or dropped, and the sentence length slider controls how varied the rhythm is. It runs in your browser and regenerates instantly.",
        "Designers use filler text so that reviewers judge layout, hierarchy and spacing instead of reading the copy. Lorem ipsum works well for this because its letter frequencies and word lengths resemble English, but it is scrambled Latin that nobody stops to read. The word list here is the standard set of about seventy words that typesetters have used since the 1960s.",
        "The stats under the output show the word, character and paragraph counts, so you can match the length of the real copy you are expecting, and Copy puts the text on your clipboard in one click.",
      ],
      howTo: [
        "Pick a unit with the Paragraphs, Sentences or Words switch.",
        "Set how many you want in the Count box.",
        "Tick Start with Lorem ipsum dolor sit amet to keep the classic opening, or untick it for fully random text.",
        "Choose Plain, HTML or Markdown as the output Format.",
        "Drag the Sentence length variance slider to make sentences more uniform or more varied, then click Generate for a fresh sample.",
        "Click Copy to copy the result; the stats show words, characters and paragraphs.",
      ],
      features: [
        "Generate by paragraphs, sentences or exact word count",
        "Plain text, HTML paragraph tags or Markdown output",
        "Optional classic Lorem ipsum dolor sit amet opening",
        "Sentence length variance slider for natural or uniform rhythm",
        "Live word, character and paragraph statistics",
        "Deterministic first sample, new text with every Generate click",
        "One click Copy, no sign up, nothing uploaded",
      ],
      faq: [
        {
          question: "Where does lorem ipsum come from?",
          answer:
            "It is scrambled Latin taken from De finibus bonorum et malorum, a treatise on ethics written by Cicero in 45 BC. The familiar opening comes from a passage in section 1.10.32 that begins Neque porro quisquam est qui dolorem ipsum quia dolor sit amet; the word dolorem was cut to dolor, and other words were shuffled and truncated over time. The result looks like Latin but has no coherent meaning.",
        },
        {
          question: "Why do designers use placeholder text instead of real copy?",
          answer:
            "Real copy draws the eye, and reviewers start editing sentences instead of judging the layout. Placeholder text with realistic word lengths and sentence rhythm lets you evaluate typography, line length, spacing and hierarchy while the actual content is still being written. It also avoids the problem of a mockup shipping with misleading claims or an unfinished paragraph that someone forgot to replace.",
        },
        {
          question: "Is lorem ipsum real Latin?",
          answer:
            "Not quite. The source is real Latin by Cicero, but the standard passage has been chopped, reordered and had letters altered to the point that it does not translate into sentences. Individual words such as dolor, sit, amet and elit are Latin, while others like adipiscing are corrupted forms. That is deliberate, since text that cannot be read is exactly what a layout placeholder needs.",
        },
        {
          question: "How much text should I generate for a page mockup?",
          answer:
            "Match the amount the real content will have. A typical blog paragraph is 40 to 80 words, a marketing card is one or two sentences, and a hero headline is 4 to 10 words. Generate slightly more than you need, then look at the word and character stats under the output. If the real copy will come from a CMS, test with both a short and a long version so the layout copes with both.",
        },
        {
          question: "What is the difference between the Plain, HTML and Markdown formats?",
          answer:
            "Plain gives paragraphs separated by single line breaks for pasting into a text field or a design tool. HTML wraps each paragraph in p tags so you can drop it straight into a template or a rich text editor's source view. Markdown separates paragraphs with a blank line, which is what Markdown needs to render them as separate blocks in a README, a docs site or a static site generator.",
        },
        {
          question: "Are there alternatives to lorem ipsum?",
          answer:
            "Yes. Some teams prefer readable placeholder text in their own language so that line lengths and capitalisation match the final copy, and there are themed generators built around bacon, hipster vocabulary, pirate speech or film quotes. Another option is to use a draft of the real content, or a public domain text such as Moby Dick, when you want stakeholders to see genuine sentences.",
        },
        {
          question: "Why does the tool show the same text every time I open the page?",
          answer:
            "The first sample is generated from a fixed seed so that the page renders identically on the server and in your browser, which avoids a flash of changing text when it loads. Click Generate to get a new random sample, and every change to the count, unit, opening or format regenerates the output immediately. Nothing is stored and nothing is sent to a server.",
        },
      ],
    },
  },
};
