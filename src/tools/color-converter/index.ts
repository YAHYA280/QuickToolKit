import type { ToolDefinition } from "../types";

export const colorConverter: ToolDefinition = {
  slug: "color-converter",
  category: "converters",
  name: "Color Converter",
  shortDescription: "Color converter for HEX, RGB, HSL and CSS syntax with a WCAG contrast checker.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hex to hsl",
    "hsl to rgb",
    "rgba to hex",
    "color code converter",
    "css color converter",
    "contrast checker",
    "wcag contrast ratio",
    "color picker online",
    "hex color code",
    "hsl color",
    "8 digit hex",
  ],
  related: ["unit-converter", "case-converter", "percentage-calculator"],
  icon: "rgb",
  content: {
    en: {
      title: "HEX to RGB, RGB to HEX & HSL Color Converter",
      description:
        "Free color converter: HEX to RGB, RGB to HEX, HSL and CSS syntax, with a live swatch and a WCAG contrast check against white and black. In your browser.",
      intro: [
        "This color converter takes any CSS color and returns every common notation at once: 6 or 8 digit HEX, comma-separated rgb() and hsl(), rgba() and hsla(), and the modern space-separated syntax with a slash for alpha. Type or paste a value such as #1e90ff or hsl(210, 100%, 56%), or pick a color by eye with the native color picker, and a large swatch on a checkerboard shows the result with its transparency. Front-end developers, designers and anyone translating a brand palette between tools use it daily. Parsing and conversion run client-side in your browser with plain JavaScript, no library and no network request.",
        "The page also works as a WCAG contrast checker. It calculates relative luminance the way browser accessibility inspectors do and reports the contrast ratio of your color against pure white and pure black, marking whether normal text passes AA at 4.5:1 or AAA at 7:1 and whether large text passes AA at 3:1.",
        "Typical uses include turning a designer's HEX value into the hsl() form that makes tints easy to derive, checking an 8 digit HEX overlay, or confirming that a placeholder grey is not too faint. Every output line has its own Copy button.",
      ],
      howTo: [
        "Type a color into the Color field, for example #1e90ff, rgb(30 144 255 / 0.5) or hsl(210, 100%, 56%).",
        "Or click the color picker next to the field to choose a color visually; the Try buttons load sample values.",
        "Read the converted values in the Formats list: HEX, RGB, RGBA, HSL, HSLA and the modern CSS rgb() and hsl() syntax.",
        "Check the swatch on the checkerboard to confirm the color and its transparency look right.",
        "Scroll to the Contrast section for the ratio On white and On black with Pass or Fail for AA 4.5:1, AAA 7:1 and AA large 3:1.",
        "Click Copy next to any value to use it in your CSS or design tool.",
      ],
      features: [
        "Accepts 3, 4, 6 and 8 digit HEX, rgb(), rgba(), hsl() and hsla()",
        "Legacy and modern CSS syntax output, with alpha",
        "Live swatch with checkerboard for transparent colors",
        "Native color picker synced with the text input",
        "WCAG 2 contrast ratio against white and black with AA, AAA and large-text results",
        "One-click copy for every format",
        "Works offline in the browser; colors are never sent anywhere",
      ],
      faq: [
        {
          question: "How do I convert HEX to RGB by hand?",
          answer:
            "Split the six digits into three pairs and convert each pair from hexadecimal to decimal. For #1e90ff, 1e is 30, 90 is 144 and ff is 255, so the color is rgb(30, 144, 255). A three-digit shorthand such as #f80 doubles each digit first, giving #ff8800. Going the other way, write each channel from 0 to 255 as two hex digits.",
        },
        {
          question: "What is the difference between RGB and HSL?",
          answer:
            "RGB mixes red, green and blue light, which matches how screens work but is hard to reason about. HSL describes the same color by hue (position on the color wheel in degrees), saturation (vividness) and lightness (closeness to black or white). HSL is handy for palettes: keep the hue and vary only lightness for consistent tints and shades.",
        },
        {
          question: "How is the WCAG contrast ratio calculated?",
          answer:
            "WCAG converts each sRGB channel to linear light and weights them (0.2126 red, 0.7152 green, 0.0722 blue) to get relative luminance. The contrast ratio is (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color, ranging from 1:1 to 21:1 for black on white. Normal text needs 4.5:1 for AA and 7:1 for AAA; large text, 24px or 19px bold, needs 3:1.",
        },
        {
          question: "What does the 8-digit HEX format mean?",
          answer:
            "The last two digits encode alpha from 00, fully transparent, to ff, fully opaque, so #1e90ff80 is a 50% transparent blue, equivalent to rgb(30 144 255 / 0.5) in modern syntax. All current browsers support it. The 4-digit form #rgba is the shorthand where each digit is doubled, so #08f8 expands to #0088ff88.",
        },
        {
          question: "Why does the HSL value change slightly when I convert back?",
          answer:
            "HEX and RGB store channels as integers from 0 to 255, while HSL uses degrees and percentages with one decimal place here, so a round trip involves rounding. The difference is a fraction of a unit and not visible on screen. If you need an exact match in a design system, keep the original notation as the source of truth.",
        },
        {
          question: "Is alpha taken into account for contrast?",
          answer:
            "No. The check uses the opaque color, because the effective contrast of a semi-transparent color depends on whatever is behind it. To evaluate a translucent overlay, work out the blended color first, for example with a screenshot and an eyedropper, then paste that opaque value here.",
        },
        {
          question: "Why does the tool say Unrecognized color?",
          answer:
            "The parser accepts HEX with 3, 4, 6 or 8 digits, with or without the leading #, and the rgb(), rgba(), hsl() and hsla() functions in legacy or modern syntax. It does not accept named colors such as tomato, the newer lab(), lch() or oklch() functions, or a HEX value with five or seven digits, which usually means a typo.",
        },
      ],
    },
  },
};
