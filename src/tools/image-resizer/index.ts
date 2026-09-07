import type { ToolDefinition } from "../types";

export const imageResizer: ToolDefinition = {
  slug: "image-resizer",
  category: "image",
  name: "Image Resizer",
  shortDescription: "Resize images by pixels, percent or preset in your browser. No upload.",
  keywords: [
    "resize image",
    "image resizer",
    "resize image online",
    "resize image to 1920x1080",
    "image resizer online",
    "resize photo",
    "resize png",
    "resize jpg",
    "change image dimensions",
    "resize image for instagram",
    "resize image by percentage",
    "scale image",
    "resize image without losing quality",
  ],
  related: ["image-compressor", "color-converter", "qr-code-generator"],
  icon: "px",
  popular: false,
  content: {
    en: {
      title: "Image Resizer: Resize Images by Pixels or Percent",
      description:
        "Resize images online for free by pixels, percent or preset (1920x1080, Instagram, Open Graph). Lock aspect ratio, crop to fit, live preview. No upload.",
      intro: [
        "This free image resizer changes the pixel dimensions of a JPG, PNG or WebP picture directly in your browser, so the file never leaves your device. Drop an image, then choose exact pixels with a locked aspect ratio, a percentage, or a preset such as 1920 x 1080, 1080 x 1080 for Instagram or 1200 x 630 for Open Graph previews. A live preview shows the result with its output dimensions and file size before you download. Presets can fit the picture inside the frame, fill it with a centered crop, or stretch it, and you can save the result as JPEG, PNG or WebP.",
        "Typical jobs include shrinking a phone photo to 1600 pixels for a blog post, producing a square profile picture, cutting a banner to the size a CMS demands, or making 512, 256 and 128 pixel icons from one master file. Resize and format change happen in one pass, so a transparent PNG can become a compact JPEG at the same time.",
        "Unlike opening Photoshop or GIMP for a two-second task, there is nothing to install and the page works on a phone. A warning appears when a setting would upscale above 100 percent, because enlarging cannot add detail the original does not contain.",
      ],
      howTo: [
        "Drag an image onto the drop zone or click to pick a file; its width, height and file size appear underneath.",
        "Choose a mode with the By pixels, By percentage or Preset switch.",
        "In By pixels, type a Width or Height; with Lock aspect ratio ticked the other value updates automatically. In By percentage, drag the Scale slider between 1 and 200 percent.",
        "For a Preset, pick a size such as 1920 x 1080 and choose Fit to keep the whole picture, Fill to crop it to the exact frame, or Stretch to ignore the ratio.",
        "Select an Output format and, for JPEG or WebP, a Quality level; the preview and Output size tile update as you change settings.",
        "Click Resize to refresh the preview, then Download to save the file, or Reset to start over with a new image.",
      ],
      features: [
        "Resize by exact pixels, by percentage or from a preset list",
        "Aspect ratio lock that recalculates the other side as you type",
        "Fit, Fill (centered crop) and Stretch modes for fixed-size presets",
        "Presets for Full HD, Instagram, Open Graph and icon sizes",
        "Live preview with output dimensions and file size",
        "Export as JPEG, PNG or WebP with a quality slider",
        "Warning before upscaling above 100 percent",
        "Runs in your browser: no upload, no watermark",
      ],
      faq: [
        {
          question: "Should I resize by pixels or by percentage?",
          answer:
            "Use pixels when a platform or template demands an exact size, such as a 1200 x 630 social preview or a 300 pixel wide thumbnail. Use percentage when you simply want the picture smaller and the exact numbers do not matter, for example 50 percent to halve a screenshot. Both give identical quality; percentage is a shortcut that keeps the aspect ratio automatically.",
        },
        {
          question: "How do I resize an image without distorting it?",
          answer:
            "Keep Lock aspect ratio ticked in By pixels mode, so changing the width recalculates the height and the picture keeps its proportions. With presets, choose Fit to shrink the whole image inside the frame or Fill to crop the edges evenly and reach the exact size; only Stretch changes the proportions.",
        },
        {
          question: "Does DPI matter when resizing for a screen?",
          answer:
            "No. DPI, dots per inch, is a print instruction that tells a printer how many pixels to place in each inch of paper; screens ignore it and display pixels one to one. A 1920 x 1080 image looks identical on a monitor whether its metadata says 72 or 300 DPI. Only pixel dimensions matter on screen, which is what this tool changes.",
        },
        {
          question: "Will upscaling make my image higher quality?",
          answer:
            "No. Enlarging an image spreads the existing pixels over a bigger area and interpolates the gaps, so a 400 pixel photo scaled to 1600 pixels becomes soft and blurry rather than sharper. The tool shows a warning whenever a setting goes above 100 percent. If you need a larger version, go back to the original camera file or a vector source.",
        },
        {
          question: "What size should an image be for Instagram or a social link preview?",
          answer:
            "Instagram square posts display at 1080 x 1080 pixels, portrait posts at 1080 x 1350, and stories at 1080 x 1920. Open Graph images used by Facebook, LinkedIn, Slack and iMessage previews work best at 1200 x 630, and Twitter cards accept the same asset. Pick the preset, choose Fill to crop to the exact frame, and export as JPEG at quality 80 to 85.",
        },
        {
          question: "Why does my transparent PNG get a white background as JPEG?",
          answer:
            "JPEG has no alpha channel, so every pixel must have an opaque color. When you export a transparent PNG as JPEG, the tool paints a white background first and draws the image on top. To keep transparency, choose PNG or WebP as the Output format; WebP supports alpha and is usually much smaller than PNG.",
        },
        {
          question: "Is my image uploaded anywhere?",
          answer:
            "No. The file is decoded, scaled with the browser's canvas API and re-encoded on your own device; the page makes no network request with your data and works offline once loaded. That makes it safe for personal photos and ID scans. The only limits are your device's memory and a cap of 8192 pixels on the long side.",
        },
      ],
    },
  },
};
