#!/usr/bin/env node
/**
 * SEO + wiring gate for tool pages. Run: pnpm check:tools
 * Parses each src/tools/<slug>/index.ts with regexes (no TS compile needed) and verifies:
 *  - slug matches folder, unique
 *  - title 30-52 chars (site name " | TabUtils" is appended: 10 chars -> <= 62 rendered)
 *  - description 120-160 chars
 *  - shortDescription <= 90 chars
 *  - keywords 6-16, lowercase
 *  - faq >= 5 questions, answers 25-120 words
 *  - intro >= 2 paragraphs, howTo >= 4, features >= 4
 *  - related slugs exist
 *  - dates.ts, loaders.ts, registry.ts reference the slug
 *  - no em dashes in content strings
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const toolsDir = path.join(root, "src", "tools");
const read = (p) => fs.readFileSync(p, "utf8");

const dates = read(path.join(toolsDir, "dates.ts"));
const loaders = read(path.join(toolsDir, "loaders.ts"));
const registry = read(path.join(toolsDir, "registry.ts"));

const slugs = fs
  .readdirSync(toolsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(toolsDir, d.name, "index.ts")))
  .map((d) => d.name);

const str = (src, key) => {
  const m = new RegExp(`\\b${key}:\\s*\\n?\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`).exec(src);
  return m ? JSON.parse(m[1].startsWith("'") ? `"${m[1].slice(1, -1).replace(/"/g, '\\"').replace(/\\'/g, "'")}"` : m[1]) : null;
};
const list = (src, key) => {
  const m = new RegExp(`\\b${key}:\\s*\\[([\\s\\S]*?)\\]`).exec(src);
  if (!m) return [];
  return [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1] ?? x[2]);
};
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

let failures = 0;
const fail = (slug, msg) => {
  failures++;
  console.log(`FAIL ${slug.padEnd(30)} ${msg}`);
};

const seenTitles = new Map();
for (const slug of slugs) {
  const src = read(path.join(toolsDir, slug, "index.ts"));
  const enStart = src.indexOf("en: {");
  const en = enStart >= 0 ? src.slice(enStart) : src;

  const declaredSlug = str(src, "slug");
  if (declaredSlug !== slug) fail(slug, `slug field is "${declaredSlug}"`);

  const title = str(en, "title");
  if (!title) fail(slug, "missing title");
  else {
    if (title.length < 30 || title.length > 52) fail(slug, `title ${title.length} chars: ${title}`);
    if (seenTitles.has(title)) fail(slug, `duplicate title with ${seenTitles.get(title)}`);
    seenTitles.set(title, slug);
  }

  const desc = str(en, "description");
  if (!desc) fail(slug, "missing description");
  else if (desc.length < 120 || desc.length > 160) fail(slug, `description ${desc.length} chars`);

  const short = str(src, "shortDescription");
  if (!short) fail(slug, "missing shortDescription");
  else if (short.length > 90) fail(slug, `shortDescription ${short.length} chars`);

  const keywords = list(src.slice(0, enStart >= 0 ? enStart : undefined), "keywords");
  if (keywords.length < 6 || keywords.length > 16) fail(slug, `keywords count ${keywords.length}`);
  for (const k of keywords) if (k !== k.toLowerCase()) fail(slug, `keyword not lowercase: ${k}`);

  const related = list(src.slice(0, enStart >= 0 ? enStart : undefined), "related");
  for (const r of related) if (!slugs.includes(r)) fail(slug, `related slug does not exist: ${r}`);

  const intro = list(en, "intro");
  if (intro.length < 2) fail(slug, `intro paragraphs ${intro.length}`);
  const howTo = list(en, "howTo");
  if (howTo.length < 4) fail(slug, `howTo steps ${howTo.length}`);
  const features = list(en, "features");
  if (features.length < 4) fail(slug, `features ${features.length}`);

  const questions = [...en.matchAll(/question:\s*\n?\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g)].length;
  const answers = [...en.matchAll(/answer:\s*\n?\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g)].map((m) =>
    JSON.parse(m[1].startsWith("'") ? `"${m[1].slice(1, -1).replace(/"/g, '\\"').replace(/\\'/g, "'")}"` : m[1]),
  );
  if (questions < 5) fail(slug, `faq questions ${questions}`);
  answers.forEach((a, i) => {
    const w = words(a);
    if (w < 25 || w > 120) fail(slug, `faq answer ${i + 1} is ${w} words`);
  });

  if (/[—–]/.test(en)) fail(slug, "em/en dash in content");

  if (!dates.includes(`"${slug}"`) && !dates.includes(`${slug}:`)) fail(slug, "missing in dates.ts");
  if (!loaders.includes(`./${slug}/Tool`)) fail(slug, "missing in loaders.ts");
  if (!registry.includes(`from "./${slug}"`)) fail(slug, "missing in registry.ts");
  if (!fs.existsSync(path.join(toolsDir, slug, "Tool.tsx"))) fail(slug, "missing Tool.tsx");
}

// registry/loaders should not reference folders that do not exist
for (const m of registry.matchAll(/from "\.\/([a-z0-9-]+)"/g)) {
  if (!slugs.includes(m[1]) && !["types", "dates", "aliases", "loaders", "categories"].includes(m[1])) fail(m[1], "registry imports a missing tool folder");
}
for (const m of loaders.matchAll(/import\("\.\/([a-z0-9-]+)\/Tool"\)/g)) {
  if (!slugs.includes(m[1])) fail(m[1], "loaders references a missing tool folder");
}

console.log(`\nChecked ${slugs.length} tools, ${failures} failure(s).`);
process.exit(failures ? 1 : 0);
