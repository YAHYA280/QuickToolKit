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
};
