import type { ToolDefinition } from "../types";

export const markdownEditor: ToolDefinition = {
  slug: "markdown-editor",
  category: "developer",
  name: "Markdown Editor",
  shortDescription: "Online Markdown editor with live preview, formatting toolbar and HTML export.",
  keywords: [
    "markdown editor",
    "online markdown editor",
    "markdown preview",
    "markdown to html",
    "markdown live preview",
    "md editor online",
    "markdown converter",
    "github flavored markdown",
    "markdown table editor",
    "readme editor",
    "markdown viewer",
    "write markdown online",
  ],
  related: ["html-entity-encoder", "text-diff", "word-counter"],
  icon: "md",
  popular: true,
  content: {
    en: {
      title: "Markdown Editor Online: Live Preview & HTML Export",
      description:
        "Free online Markdown editor with live preview. Format with a toolbar, watch GFM tables and code blocks render as you type, then copy or download the HTML.",
      intro: [
        "This online Markdown editor shows a live preview next to your text as you type, so you can see exactly how headings, lists, tables and code blocks will look before you publish. Paste a README, a blog draft or release notes, tidy it up with the Bold, Italic, Heading, Link, Code, List and Quote buttons, and export clean HTML when you are done. Rendering uses the marked parser with GitHub Flavored Markdown enabled and every result is sanitized. The whole page runs in your browser, so your draft is never uploaded to a server.",
        "It is handy when you are writing documentation on a machine without your usual editor, when you want to check how a table or nested list renders before pasting it into GitHub, GitLab or a CMS, or when you need a quick HTML fragment for an email or a static site. The Split view keeps source and preview side by side, while Editor and Preview give either one the full width on a small screen.",
        "Word, character and heading counts update as you type, which helps when a post has a length target. Copy Markdown and Copy HTML put either format on the clipboard, and the Download buttons save a .md file or a standalone .html page.",
      ],
      howTo: [
        "Type or paste Markdown into the Markdown pane. The page opens with a sample document that you can replace or edit.",
        "Select some text and click B, I, Link or Code in the toolbar to wrap it, or click H, List or Quote to prefix the current line. Ctrl+B and Ctrl+I work while typing.",
        "Watch the Preview pane update as you type. Tables, task lists, fenced code blocks and strikethrough follow GitHub Flavored Markdown.",
        "Use the Split, Editor and Preview buttons to change the layout, for example Preview alone on a phone.",
        "Check the Words, Characters and Headings counters under the panes to keep an eye on length and structure.",
        "Click Copy HTML or Copy Markdown to copy the result, or Download .md and Download .html to save a file.",
      ],
      features: [
        "Live preview rendered as you type with GitHub Flavored Markdown",
        "Toolbar for bold, italic, headings, links, inline code, lists and quotes",
        "Split, Editor and Preview layouts for desktop and mobile",
        "Copy sanitized HTML or the raw Markdown to the clipboard",
        "Download as a .md file or a standalone .html page",
        "Word, character and heading counters",
        "Tables, task lists, fenced code blocks and strikethrough supported",
        "100% client-side, nothing is uploaded",
      ],
      faq: [
        {
          question: "What is Markdown and why is it used?",
          answer:
            "Markdown is a lightweight markup language created by John Gruber in 2004. You write plain text with simple symbols, such as # for a heading, * for emphasis and - for a list item, and a converter turns it into HTML. It is popular for README files, documentation, forum posts and blogs because the source stays readable, works in any text editor and can be tracked in version control.",
        },
        {
          question: "Does this editor support GitHub Flavored Markdown?",
          answer:
            "Yes. The preview is generated with the marked parser in GFM mode, so tables, task lists with [ ] and [x], strikethrough with two tildes, fenced code blocks and automatic links all render the way they do on GitHub. Standard CommonMark syntax such as headings, emphasis, blockquotes, nested lists and images is supported as well.",
        },
        {
          question: "Is my text uploaded anywhere?",
          answer:
            "No. Parsing and rendering happen entirely in your browser with JavaScript, and the page makes no network request containing your document. You can load the page, disconnect from the internet and keep editing. Nothing is stored unless you download a file or copy to the clipboard yourself, so private notes, unpublished drafts and internal documentation are safe to paste here.",
        },
        {
          question: "How do I convert Markdown to HTML?",
          answer:
            "Write or paste your Markdown, then click Copy HTML to place the rendered fragment on the clipboard, or click Download .html to save a complete page with a doctype, character set and a title taken from your first heading. The HTML is sanitized with DOMPurify, which removes scripts and event handlers, so it is safe to paste into a CMS or a static site generator.",
        },
        {
          question: "Why does my table not render?",
          answer:
            "GFM tables need a header row, a separator row made of dashes such as | --- | --- |, and pipe characters between the cells on every row. A missing separator line is the most common mistake, followed by a missing blank line before the table. Cells can contain inline formatting but not block elements. Fix the separator row, check the preview and the table should appear.",
        },
        {
          question: "Can I use HTML inside Markdown?",
          answer:
            "Yes, Markdown allows raw HTML, and this editor renders inline tags such as span, sup, kbd and details. For safety the output is passed through DOMPurify, so script tags, inline event handlers like onclick and javascript: links are stripped from both the preview and the exported HTML. If you rely on embedded scripts, add them after exporting in a trusted environment.",
        },
        {
          question: "Does the editor save my work?",
          answer:
            "The editor keeps your text only while the tab is open; reloading the page restores the sample document. Before you leave, click Download .md to save the source or Copy Markdown to paste it into another application. Keeping the source file is the better choice because Markdown can be regenerated into HTML at any time, while converting HTML back into Markdown is lossy.",
        },
      ],
    },
  },
};
