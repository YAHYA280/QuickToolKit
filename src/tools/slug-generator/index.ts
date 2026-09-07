import type { ToolDefinition } from "../types";

export const slugGenerator: ToolDefinition = {
  slug: "slug-generator",
  category: "text",
  name: "Slug Generator",
  shortDescription: "Free slug generator: turn any title into a clean, SEO friendly URL slug.",
  keywords: [
    "slug generator",
    "url slug generator",
    "seo friendly url",
    "slugify online",
    "create url slug",
    "title to slug",
    "permalink generator",
    "url friendly text",
    "remove accents from url",
    "hyphen vs underscore url",
    "slug maker",
    "clean url generator",
  ],
  related: ["case-converter", "url-encoder", "word-counter"],
  icon: "a-b",
  popular: false,
  content: {
    en: {
      title: "Slug Generator: Create SEO Friendly URL Slugs",
      description:
        "Free slug generator: turn titles into clean, SEO friendly URL slugs. Strip accents, drop stop words, set separator and length. Runs in your browser.",
      intro: [
        "This slug generator turns a page title, product name or headline into a clean URL slug in the format search engines and content systems expect: lowercase words separated by hyphens, with accents, punctuation and stray spaces removed. Paste one title per line and every line becomes a slug, so you can prepare a whole batch of blog posts, categories or SKUs at once. Options let you switch to underscores, keep capital letters, drop filler words such as the and of, and cap the length at a word boundary. The tool runs entirely in your browser and nothing you type is sent anywhere.",
        "Use it when a CMS generated a slug from a draft title that has since changed, when a migration needs consistent permalinks for hundreds of pages, or when a non-English title contains characters that break older systems. Accent stripping uses Unicode normalization so é becomes e, ü becomes u and ß becomes ss, and a preview shows the final address with your own base URL in front of it.",
        "Each slug gets a length badge, and the summary shows how many slugs were produced and their average length, which helps keep addresses short enough to display in full in search results and social previews.",
      ],
      howTo: [
        "Type or paste titles into the Titles box, one per line. The sample titles can be replaced or edited.",
        "Pick a Separator: Hyphen, Underscore or None. Hyphens are the recommended choice for public URLs.",
        "Leave Lowercase and Transliterate accents ticked for standard slugs, or untick them to keep capital letters and Unicode characters.",
        "Tick Remove stop words to drop filler words such as a, an, the, of and and from each slug.",
        "Set Max length to limit each slug; it is trimmed at the last separator before the limit rather than in the middle of a word.",
        "Enter your site address in Base URL for preview to see the full links, then click Copy slugs or Copy URLs.",
      ],
      features: [
        "Batch conversion, one title per line",
        "Hyphen, underscore or no separator",
        "Accent removal with Unicode NFD normalization plus ß, æ, ø, ł and œ handling",
        "Optional stop word removal",
        "Max length with trimming at a word boundary",
        "Full URL preview with a custom base address",
        "Per-slug length badges and an average length stat",
        "Runs in the browser, no data leaves your device",
      ],
      faq: [
        {
          question: "What is a URL slug?",
          answer:
            "A slug is the human readable part of a web address that identifies one page, usually the last segment after the domain and folder path. In example.com/blog/how-to-brew-coffee the slug is how-to-brew-coffee. Good slugs are lowercase, use hyphens between words, contain only letters and digits, and describe the content of the page so that people and search engines can guess what they will find.",
        },
        {
          question: "Hyphens or underscores: which is better for SEO?",
          answer:
            "Hyphens. Google has said for years that it treats a hyphen as a word separator, so how-to-brew-coffee is read as four words, while an underscore joins words together, so how_to_brew_coffee can be read as a single token. Hyphens are also easier to see in an underlined link. Underscores are fine for identifiers in code and file names, which is why the tool still offers them.",
        },
        {
          question: "How long should a slug be?",
          answer:
            "Keep slugs as short as they can be while still describing the page, roughly three to six words or under 60 characters. Long slugs get truncated in search results and share previews, and they are harder to type or read aloud. The Max length option trims at the last separator before the limit so you never end up with half a word at the end.",
        },
        {
          question: "Should I include dates or numbers in the slug?",
          answer:
            "Avoid dates unless the content is truly time specific, such as an event listing. A date in the address makes evergreen content look stale and forces a redirect if you update the post later. Version numbers, model numbers and years that are part of the title, such as a product name, are fine. Remove stop words and articles instead to make room for meaningful words.",
        },
        {
          question: "What happens to accented and non-Latin characters?",
          answer:
            "With Transliterate accents ticked, Latin letters are decomposed with Unicode NFD normalization and their diacritics are removed, so é becomes e and ñ becomes n; special cases such as ß to ss, æ to ae, ø to o and ł to l are mapped directly. Cyrillic, Arabic, Chinese and other scripts have no simple Latin equivalent and are dropped. Untick the option to keep Unicode letters, which modern browsers display correctly.",
        },
        {
          question: "Can I change a slug after a page is published?",
          answer:
            "You can, but every change breaks the old address, so set up a 301 redirect from the old slug to the new one and update your internal links. Search engines pass most ranking signals through a permanent redirect, though it can take weeks. Pick a stable slug before publishing, based on the main keyword rather than a working title that may still change.",
        },
        {
          question: "Are the slugs generated on a server?",
          answer:
            "No. Everything runs in your browser using JavaScript string functions and the built-in Unicode normalization API, so your titles, product names and draft headlines never leave your device. The page keeps working offline once it has loaded. Because the rules are deterministic, the same title always yields the same slug, which makes the tool safe to use for bulk migrations.",
        },
      ],
    },
  },
};
