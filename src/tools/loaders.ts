"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * One lazy chunk per tool. Lives in a client module so the bundler treats each
 * import() as an independent chunk group; only the rendered tool is downloaded.
 */
export const toolLoaders: Record<string, ComponentType> = {
  "json-formatter": dynamic(() => import("./json-formatter/Tool")),
  base64: dynamic(() => import("./base64/Tool")),
  "url-encoder": dynamic(() => import("./url-encoder/Tool")),
  "jwt-decoder": dynamic(() => import("./jwt-decoder/Tool")),
  "uuid-generator": dynamic(() => import("./uuid-generator/Tool")),
  "hash-generator": dynamic(() => import("./hash-generator/Tool")),
  "regex-tester": dynamic(() => import("./regex-tester/Tool")),
  "word-counter": dynamic(() => import("./word-counter/Tool")),
  "case-converter": dynamic(() => import("./case-converter/Tool")),
  "password-generator": dynamic(() => import("./password-generator/Tool")),
  "color-converter": dynamic(() => import("./color-converter/Tool")),
  "unit-converter": dynamic(() => import("./unit-converter/Tool")),
  "loan-calculator": dynamic(() => import("./loan-calculator/Tool")),
  "compound-interest-calculator": dynamic(() => import("./compound-interest-calculator/Tool")),
  "percentage-calculator": dynamic(() => import("./percentage-calculator/Tool")),
  "qr-code-generator": dynamic(() => import("./qr-code-generator/Tool")),
  "unix-timestamp-converter": dynamic(() => import("./unix-timestamp-converter/Tool")),
  "image-compressor": dynamic(() => import("./image-compressor/Tool")),
  "image-resizer": dynamic(() => import("./image-resizer/Tool")),
  "text-diff": dynamic(() => import("./text-diff/Tool")),
  "mortgage-calculator": dynamic(() => import("./mortgage-calculator/Tool")),
  "emi-calculator": dynamic(() => import("./emi-calculator/Tool")),
  "credit-card-payoff-calculator": dynamic(() => import("./credit-card-payoff-calculator/Tool")),
  "salary-to-hourly-calculator": dynamic(() => import("./salary-to-hourly-calculator/Tool")),
  "tip-calculator": dynamic(() => import("./tip-calculator/Tool")),
  "discount-calculator": dynamic(() => import("./discount-calculator/Tool")),
  "cron-expression-generator": dynamic(() => import("./cron-expression-generator/Tool")),
  "chmod-calculator": dynamic(() => import("./chmod-calculator/Tool")),
  "csv-to-json": dynamic(() => import("./csv-to-json/Tool")),
  "lorem-ipsum-generator": dynamic(() => import("./lorem-ipsum-generator/Tool")),
  "markdown-editor": dynamic(() => import("./markdown-editor/Tool")),
  "html-entity-encoder": dynamic(() => import("./html-entity-encoder/Tool")),
  "slug-generator": dynamic(() => import("./slug-generator/Tool")),
};
