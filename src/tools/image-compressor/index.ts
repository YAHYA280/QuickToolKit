import type { ToolDefinition } from "../types";

export const imageCompressor: ToolDefinition = {
  slug: "image-compressor",
  category: "image",
  name: "Image Compressor",
  shortDescription: "Compress images in your browser: shrink JPG, PNG and WebP with no upload.",
  keywords: [
    "compress image",
    "image compressor",
    "compress jpg",
    "compress png",
    "compress webp",
    "reduce image size",
    "image compressor online",
    "compress image to 100kb",
    "shrink image size",
    "compress photo",
    "reduce image file size",
    "convert png to webp",
    "bulk image compressor",
  ],
  related: ["image-resizer", "base64", "color-converter"],
  icon: "jpg",
  popular: true,
  content: {
    en: {
      title: "Image Compressor: Compress JPG, PNG & WebP Online",
      description:
        "Compress images online for free. Shrink JPG, PNG and WebP by up to 80% with a quality slider and batch queue. No upload: files never leave your browser.",
      intro: [
        "This free image compressor shrinks JPG, PNG and WebP files directly in your browser, so your photos never leave your device. Drop one picture or a whole batch, choose an output format and a quality level, and click Compress all. Each file is decoded and re-encoded with the browser's own canvas engine, which typically takes a 3 to 4 MB phone photo down to a few hundred kilobytes with no visible loss. Every row shows the size before and after plus the percentage saved, and you can download files one at a time or all at once. Nothing is uploaded, so it is safe for private photos.",
        "Use it before attaching pictures to an email with a size limit, uploading product shots to a store, or trimming hero images so a web page passes Core Web Vitals. WebP usually gives the smallest file at the same visual quality, while JPEG remains the safe choice for older software, printing services and email clients.",
        "Compared with desktop apps such as ImageOptim or command-line tools like cwebp and mozjpeg, this page needs no install and runs on any phone or locked-down work laptop. A batch of twenty photos finishes in seconds.",
      ],
      howTo: [
        "Drag images onto the drop zone or click it to pick files; JPG, PNG, WebP, GIF and BMP are accepted, several at once.",
        "Choose an Output format: Keep original, JPEG, WebP or PNG. WebP is smallest; JPEG is the most compatible.",
        "Set the Quality slider; 80 is a good default for photos. It is disabled for PNG because PNG is lossless.",
        "Optionally enter a Max width in pixels to downscale large photos, or leave it empty to keep the original dimensions.",
        "Click Compress all; each row updates with its new size and percentage saved, and the Total saved tile sums the batch.",
        "Click Download on a single row, Download all to save every file in turn, or Clear to start a new batch.",
      ],
      features: [
        "Batch queue: compress dozens of images in one go",
        "JPEG, WebP and PNG output, or keep the original format",
        "Quality slider from 10 to 100, default 80",
        "Optional max width to downscale oversized photos",
        "Before and after sizes plus percentage saved per file and in total",
        "EXIF, GPS and camera metadata removed automatically",
        "Download files one by one or all at once",
        "100% client-side: no upload, no account, no watermark",
      ],
      faq: [
        {
          question: "Should I use JPEG, WebP or PNG for the smallest file?",
          answer:
            "For photographs, WebP is usually 25 to 35 percent smaller than JPEG at the same visual quality and every modern browser supports it. JPEG is still the safest choice when the file will be opened by older software, printed, or emailed. PNG is lossless and best for screenshots, logos and graphics with sharp edges or transparency, but it produces much larger files for photos.",
        },
        {
          question: "What does quality 80 mean?",
          answer:
            "The quality value controls how aggressively the JPEG or WebP encoder discards fine detail. 100 keeps almost everything and produces large files, while 10 introduces visible blocks and smearing. Around 80 the file is typically a quarter of the original size and the difference is invisible at normal viewing distance, so most photo sites default to it. Try 60 to 70 for thumbnails.",
        },
        {
          question: "Why does my PNG barely shrink?",
          answer:
            "PNG is a lossless format, so re-encoding it cannot throw away any pixel data; the only savings come from stripping metadata or reducing the dimensions with Max width. If the image is a photo, switch the Output format to JPEG or WebP and you will usually see a 70 to 90 percent reduction. Keep PNG for images that need transparency or crisp text and line art.",
        },
        {
          question: "Does the compressor remove EXIF and location data?",
          answer:
            "Yes. The image is decoded to raw pixels and re-encoded with the browser's canvas API, which writes a clean file with no EXIF block, so camera model, capture date, GPS coordinates and embedded thumbnails are all gone. This is good for privacy when sharing photos online. The trade-off is that color profiles are also dropped; images are written in the standard sRGB space.",
        },
        {
          question: "What size should an image be for the web or email?",
          answer:
            "For a full-width web hero image, aim for 1600 to 1920 pixels wide and under 300 KB; for inline blog images, 800 to 1200 pixels and under 150 KB is plenty. Email clients render images small, so 1000 pixels wide at quality 70 is usually enough and keeps a message under attachment limits. Set the Max width field to hit these targets in one pass.",
        },
        {
          question: "Does compression reduce the resolution of my image?",
          answer:
            "Not unless you ask it to. With Max width left empty, the output has exactly the same pixel dimensions as the input; only the encoding changes. If you enter a Max width, images wider than that value are scaled down proportionally, which reduces the file size far more than the quality slider alone. Images already narrower than the limit are left at their original size.",
        },
        {
          question: "Is there a limit on file size or number of images?",
          answer:
            "There is no upload limit because nothing is uploaded. The practical constraint is your device's memory: images larger than 8192 pixels on the long side are rejected, and a batch of large photos may take a few seconds on a phone. Files are processed one after another so the page stays responsive. Animated GIFs are flattened to their first frame.",
        },
      ],
    },
  },
};
