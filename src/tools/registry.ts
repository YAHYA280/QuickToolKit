import type { CategorySlug, ToolContent, ToolDefinition } from "./types";
import { jsonFormatter } from "./json-formatter";
import { base64Tool } from "./base64";
import { urlEncoder } from "./url-encoder";
import { jwtDecoder } from "./jwt-decoder";
import { uuidGenerator } from "./uuid-generator";
import { hashGenerator } from "./hash-generator";
import { regexTester } from "./regex-tester";
import { wordCounter } from "./word-counter";
import { caseConverter } from "./case-converter";
import { passwordGenerator } from "./password-generator";
import { colorConverter } from "./color-converter";
import { unitConverter } from "./unit-converter";
import { loanCalculator } from "./loan-calculator";
import { compoundInterestCalculator } from "./compound-interest-calculator";
import { percentageCalculator } from "./percentage-calculator";
import { qrCodeGenerator } from "./qr-code-generator";
import { unixTimestampConverter } from "./unix-timestamp-converter";
import { imageCompressor } from "./image-compressor";
import { imageResizer } from "./image-resizer";
import { textDiff } from "./text-diff";
import { mortgageCalculator } from "./mortgage-calculator";
import { emiCalculator } from "./emi-calculator";
import { creditCardPayoffCalculator } from "./credit-card-payoff-calculator";
import { salaryToHourlyCalculator } from "./salary-to-hourly-calculator";
import { tipCalculator } from "./tip-calculator";
import { discountCalculator } from "./discount-calculator";
import { cronExpressionGenerator } from "./cron-expression-generator";
import { chmodCalculator } from "./chmod-calculator";
import { csvToJson } from "./csv-to-json";
import { loremIpsumGenerator } from "./lorem-ipsum-generator";
import { markdownEditor } from "./markdown-editor";
import { htmlEntityEncoder } from "./html-entity-encoder";
import { slugGenerator } from "./slug-generator";

export const tools: ToolDefinition[] = [
  // developer
  jsonFormatter,
  unixTimestampConverter,
  base64Tool,
  urlEncoder,
  jwtDecoder,
  uuidGenerator,
  hashGenerator,
  regexTester,
  cronExpressionGenerator,
  chmodCalculator,
  csvToJson,
  markdownEditor,
  htmlEntityEncoder,
  // text
  wordCounter,
  textDiff,
  caseConverter,
  passwordGenerator,
  loremIpsumGenerator,
  slugGenerator,
  // converters
  colorConverter,
  unitConverter,
  // image
  imageCompressor,
  imageResizer,
  qrCodeGenerator,
  // finance
  loanCalculator,
  compoundInterestCalculator,
  percentageCalculator,
  mortgageCalculator,
  emiCalculator,
  creditCardPayoffCalculator,
  salaryToHourlyCalculator,
  tipCalculator,
  discountCalculator,
];

const bySlug = new Map(tools.map((t) => [t.slug, t]));

export function getTool(slug: string): ToolDefinition | undefined {
  return bySlug.get(slug);
}

export function getToolsByCategory(category: CategorySlug): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}

export function getRelatedTools(tool: ToolDefinition, limit = 4): ToolDefinition[] {
  const explicit = tool.related
    .map((slug) => bySlug.get(slug))
    .filter((t): t is ToolDefinition => Boolean(t));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const sameCategory = tools.filter(
    (t) => t.category === tool.category && t.slug !== tool.slug && !explicit.includes(t),
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

export function getToolContent(tool: ToolDefinition, locale: string): ToolContent {
  return tool.content[locale] ?? tool.content.en;
}

export function getPopularTools(limit = 8): ToolDefinition[] {
  const popular = tools.filter((t) => t.popular);
  return (popular.length ? popular : tools).slice(0, limit);
}
