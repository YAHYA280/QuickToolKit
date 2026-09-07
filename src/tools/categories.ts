import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "developer",
    name: "Developer tools",
    title: "Developer Tools Online: JSON, Base64, JWT, Regex",
    description:
      "Free developer tools that run in your browser: JSON formatter, Base64 and URL encoders, JWT decoder, hash and UUID generators, and a regex tester.",
    intro: [
      "These developer tools cover the small, repetitive jobs that interrupt real work: making a minified API response readable, checking whether a token has expired, turning a string into Base64 for a header, or confirming that a regular expression matches the lines you expect. Each one opens instantly, needs no account, and processes your input with standard browser APIs such as JSON.parse, TextEncoder, crypto.subtle and RegExp.",
      "Nothing you paste is uploaded. That matters for developers because the inputs are often production tokens, customer records or internal URLs. You can open any of these pages, disconnect from the network, and keep working. Every tool also explains its edge cases in a short FAQ, so you can check a detail like Base64 padding or JWT clock skew without leaving the page.",
    ],
    icon: "</>",
  },
  {
    slug: "text",
    name: "Text tools",
    title: "Text Tools Online: Word Counter, Case Converter",
    description:
      "Free text tools for writers and coders: count words and characters, convert text case, and generate strong passwords, all processed in your browser.",
    intro: [
      "Text tools for anyone who writes: students checking an essay limit, marketers trimming a meta description, developers renaming identifiers between camelCase and snake_case, and people who just need a strong password. Counts and conversions update as you type, and the results are ready to copy in one click.",
      "All processing happens in your browser tab, so drafts, cover letters and unpublished manuscripts stay on your device. The password generator draws from a cryptographic random source and shows the entropy of what it produces, so you can see why length beats complexity before you save anything to a password manager.",
    ],
    icon: "Aa",
  },
  {
    slug: "finance",
    name: "Finance calculators",
    title: "Finance Calculators: Loan, Interest & Percentage",
    description:
      "Free finance calculators: loan payments and amortization, compound interest growth, and everyday percentage maths for tax, tips and discounts.",
    intro: [
      "Finance calculators built around the standard formulas that banks and textbooks use: the amortizing loan payment formula for car, personal and home loans, compound interest with regular monthly deposits, and everyday percentage maths for tax, tips, discounts and percentage change. Each result is shown with the figures behind it, including a full amortization schedule and year-by-year growth tables.",
      "The numbers are estimates for planning and comparison. They do not include lender fees, taxes, insurance or investment risk, and they are not financial advice. Use them to compare offers and understand the trade-offs, then confirm the final figures with your lender, bank or a qualified advisor.",
    ],
    icon: "$",
  },
  {
    slug: "converters",
    name: "Converters",
    title: "Unit & Color Converters Online: HEX to RGB & More",
    description:
      "Free online converters for units and colors: length, weight, temperature, volume and data units, plus HEX, RGB and HSL codes with a WCAG contrast check.",
    intro: [
      "Converters for the values you look up most: length, weight, temperature, area, volume, speed and data units, plus HEX, RGB and HSL color codes with a live swatch. Pick a category and two units and the result updates instantly, with a table that shows the same value in every unit of that category.",
      "The color converter also checks WCAG contrast against white and black, so you can tell at a glance whether a brand color is readable as text. Unit conversions use exact factors where the standard defines one (an inch is exactly 25.4 mm) and clearly labelled approximations elsewhere, and the FAQ on each page explains the traps, like US versus imperial gallons or KB versus KiB.",
    ],
    icon: "⇄",
  },
  {
    slug: "image",
    name: "Image tools",
    title: "Image Tools Online: Compress, Resize, QR Codes",
    description:
      "Free image tools that run in your browser: compress JPG and PNG, resize images to exact pixels, and generate QR codes. No upload, no watermark.",
    intro: [
      "Image tools that never upload your files. Compression and resizing use the browser's own canvas and encoder, so a photo goes from your disk to a smaller file without touching a server. That matters for screenshots with private data, product photos before launch, and anything you would not email to a stranger.",
      "The QR code generator draws codes for links, Wi-Fi, text and contact cards, with size, margin and error-correction controls, and exports PNG or SVG for print. Every tool shows the before and after numbers so you can see exactly what changed.",
    ],
    icon: "img",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug);
}
