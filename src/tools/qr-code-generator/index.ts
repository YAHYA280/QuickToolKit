import type { ToolDefinition } from "../types";

export const qrCodeGenerator: ToolDefinition = {
  slug: "qr-code-generator",
  category: "image",
  name: "QR Code Generator",
  shortDescription: "Free QR code generator for URLs, Wi-Fi, contacts and email. PNG and SVG export.",
  keywords: [
    "qr code generator",
    "free qr code generator",
    "qr code maker",
    "create qr code",
    "qr code generator online",
    "wifi qr code generator",
    "vcard qr code",
    "qr code for url",
    "qr code svg download",
    "custom color qr code",
    "qr code png",
    "email qr code generator",
    "generate qr code free",
  ],
  related: ["url-encoder", "color-converter", "base64"],
  icon: "qr",
  popular: true,
  content: {
    en: {
      title: "QR Code Generator: Free, Custom Colors, PNG & SVG",
      description:
        "Free QR code generator for URLs, Wi-Fi, vCard contacts and email. Choose size, colors and error correction, then download PNG or SVG. In your browser.",
      intro: [
        "This free QR code generator creates a scannable code for a website URL, plain text, Wi-Fi login details, a vCard contact or a pre-filled email, and renders it live as you type. Choose the pixel size, the quiet-zone margin, the error correction level and custom foreground and background colors, then download the result as a PNG for screens or an SVG for print. Everything is computed in your browser with the open source qrcode library, so passwords, contact details and private links are never uploaded.",
        "Use it to put a menu on a poster, share your Wi-Fi with guests without spelling out the password, add a contact card to a business card, or let customers start a support email with the subject filled in. The encoded payload is shown under the preview so you can see exactly what a scanner will read.",
        "There is no account, no watermark and no expiry: the codes are static and keep working as long as the content behind them exists.",
      ],
      howTo: [
        "Pick a content type with the URL, Text, Wi-Fi, Contact or Email switch.",
        "Fill in the fields for that type, such as Network name, Password and Encryption for Wi-Fi, or Full name, Phone and Email for a contact.",
        "Set the Size slider (128 to 1024 pixels) and the Margin slider for the quiet zone around the code.",
        "Choose an Error correction level (M for screens, H for small or damaged prints) and set the Front and Back color pickers for a branded code.",
        "Check the preview and the Encoded payload box to confirm the content, and watch the character counter.",
        "Click Download PNG for a raster image, Download SVG for a vector file, or Copy payload to reuse the text.",
      ],
      features: [
        "URL, text, Wi-Fi (WPA, WEP or open), vCard 3.0 contact and mailto email",
        "Live preview that redraws as you type",
        "Size from 128 to 1024 pixels with an adjustable quiet zone",
        "Error correction levels L, M, Q and H",
        "Custom foreground and background colors",
        "PNG and resolution-independent SVG download",
        "Shows the encoded payload, its length and the QR version",
        "Runs 100% in the browser; nothing is uploaded",
      ],
      faq: [
        {
          question: "What do the QR code error correction levels L, M, Q and H mean?",
          answer:
            "Error correction adds redundant data so a scanner can rebuild the code when part of it is damaged or covered. Level L tolerates about 7% damage, M 15%, Q 25% and H 30%. Higher levels need more modules, so the code gets denser for the same content. M suits screens and clean prints; H is safest for stickers or packaging that may get damaged.",
        },
        {
          question: "How much data can a QR code hold?",
          answer:
            "The largest symbol, version 40 at error correction level L, stores up to 2953 bytes of binary data, 4296 alphanumeric characters or 7089 digits. Raising the error correction level cuts capacity to roughly 1273 bytes at level H. In practice anything over a few hundred characters produces a dense grid that phone cameras struggle with, which is why the tool warns above 1000 characters.",
        },
        {
          question: "Is my data uploaded when I generate a QR code?",
          answer:
            "No. The code is computed and drawn entirely in your browser using the open source qrcode library, and the page makes no network request with your content. Wi-Fi passwords, contact details and private links never leave your device. You can load the page, go offline and keep generating codes, which also makes it safe on a locked-down work machine.",
        },
        {
          question: "How big should I print a QR code?",
          answer:
            "A rule of thumb is a minimum of 2 cm by 2 cm (about 0.8 inches) for a short URL scanned from 10 to 20 cm away, and roughly one tenth of the expected scanning distance for signage. Dense codes with long payloads must be printed bigger. Keep the quiet zone at least four modules wide and use strong contrast between foreground and background.",
        },
        {
          question: "What is the difference between a static and a dynamic QR code?",
          answer:
            "A static QR code, which is what this tool makes, encodes the content directly, so it works forever without any service and cannot be changed after printing. A dynamic QR code encodes a short redirect URL managed by a provider; you can change the destination and see scan statistics, but it stops working if the provider shuts down or you stop paying.",
        },
        {
          question: "Can I download the QR code as SVG and use my own colors?",
          answer:
            "Yes. Download SVG gives a resolution-independent vector file that prints sharply at any size and can be edited in Illustrator, Inkscape or Figma; Download PNG exports the preview at the pixel size you chose. The Front and Back color pickers apply to both formats. Keep the foreground much darker than the background, because inverted or low-contrast codes fail on many scanners.",
        },
        {
          question: "Why does my Wi-Fi or contact QR code not scan?",
          answer:
            "Check that the network name or contact name is filled in, that the encryption type matches your router (WPA2 and WPA3 networks use the WPA setting), and that the code is large enough with a clear margin. Some older camera apps only open URLs and do not understand WIFI: or vCard payloads; a dedicated scanner app will.",
        },
      ],
    },
  },
};
