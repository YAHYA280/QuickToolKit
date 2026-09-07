# TabUtils – free online tools site (tabutils.com)

Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui + next-intl. Every tool runs client-side; all pages are statically generated. Built to be monetized with Google AdSense.

## Run

```bash
pnpm install
cp .env.example .env.local   # then edit
pnpm dev                     # http://localhost:3000
pnpm build && pnpm start     # production check
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, no trailing slash. Used in canonical/hreflang, sitemap, JSON-LD. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Fallback email shown on the Contact page (forwarded via ImprovMX). |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-…`. Empty = no ad scripts loaded (dev, preview, pre-approval). |
| `NEXT_PUBLIC_ADSENSE_SLOT_*` | Optional manual ad unit ids for top / in-article / sidebar. Auto Ads work without them. |

## Design system

- Direction: Brutalist Utility. Tokens in `src/app/globals.css` (shadcn names + `--brand` blue for actions/text, `--highlight` yellow for surfaces). Light = off-white #F4F3EC with ink #0A0A0A lines; dark = inverted. Zero radius, 2px borders, hard offset shadows (`shadow-hard`, `.brut`). Toggle via next-themes (`class` strategy).
- Fonts: Archivo Black (display, uppercase), Work Sans (body), Space Mono (data), loaded with `next/font`.
- shadcn/ui components in `src/components/ui` (radix-nova preset, RTL on). Add more with `npx shadcn@latest add <name>`.
- Tool primitives in `src/components/tools/ui.tsx` wrap shadcn so every tool looks the same: `ToolPanel`, `ToolActions`, `Label`, `TextArea`, `NumberInput`, `SelectField`, `CheckboxField`, `SwitchField`, `SliderField`, `Segmented`, `Button`, `CopyButton`, `Stat`, `Chip`, `Hint`, `ErrorText`.
- Also in `ui.tsx`: `CodeBlock` (JSON syntax highlighting + line numbers + flash on update), `useHotkey("mod+enter", fn)`, `KbdHint`, `locateJsonError` / `cleanJsonError` (line/col from any engine's JSON.parse message).
- `ToolFrame` wraps every tool with window chrome (`~/tools/slug`, live "runs locally" status with tooltip). `CopyLinkButton` in the tool header.
- Utilities: `.label-mono` / `.label-mono-muted` (small uppercase mono label), `.brut` / `.brut-sm` / `.brut-flat` (bordered box with hard shadow), `.bg-grid` (graph-paper lines), `.stagger` (card reveal), `.code-surface`, `.syn-*` (syntax colors), `animate-flash` / `animate-pop`. shadcn primitives are restyled globally via `[data-slot]` rules in globals.css, so the files in `src/components/ui` stay stock. `<details>` open/close is animated via `::details-content`. Route changes fade in via `app/[locale]/template.tsx`.
- Ctrl/Cmd+K opens the command palette (`CommandMenu`).

## Contact form + admin inbox

- `/contact` stores messages in PostgreSQL (`messages` table, created automatically on first use). Honeypot, timing check and a per-IP rate limit (3 per 15 min, IP stored hashed).
- `/admin` password login (`ADMIN_PASSWORD`), signed cookie (`ADMIN_SECRET`), 7-day session. `/admin/messages` lists messages with unread filter, mark read, delete, and a reply link that opens your mail client. Admin pages are `noindex` and disallowed in robots.txt.
- Env: `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`. Set them in Vercel too.

## Add a tool

1. Create `src/tools/<slug>/Tool.tsx` (`"use client"`, default export) using primitives from `src/components/tools/ui.tsx`.
2. Create `src/tools/<slug>/index.ts` exporting a `ToolDefinition` (meta + `content.en` with intro, howTo, features, 5 FAQs). 350-600 words of real content per tool; thin pages fail AdSense review.
3. Add it to the `tools` array in `src/tools/registry.ts`, `src/tools/loaders.ts` (dynamic import), `src/tools/dates.ts` and optionally `src/tools/aliases.ts`.
4. Run `pnpm check:tools`. It enforces title/description lengths, FAQ count and answer length, related slugs, dates, loader and registry wiring. The build should not ship while it fails.

Pages, sitemap, JSON-LD (WebApplication + FAQPage + BreadcrumbList), breadcrumbs and related tools are generated from the registry.

## Add a language

1. Add the locale to `locales` in `src/i18n/routing.ts`.
2. Create `messages/<locale>.json` (copy `en.json`).
3. Add `content.<locale>` to each tool definition (falls back to `en`).
4. `localeDirection` in routing.ts handles RTL for `ar`.

URLs: default locale at `/`, others at `/<locale>/…`. hreflang tags are emitted for every configured locale.

## Deploy (Vercel)

1. Push to GitHub, import in Vercel, framework auto-detected.
2. Set the env vars above in the Vercel project.
3. Add the custom domain, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
4. Google Search Console: verify the domain, submit `/sitemap.xml`.

## AdSense checklist

- [ ] Custom domain live, 15+ tool pages indexed, About / Contact / Privacy / Terms present (done in code).
- [ ] Apply at adsense.google.com with the domain.
- [ ] Set `NEXT_PUBLIC_ADSENSE_CLIENT`; the `<meta name="google-adsense-account">` tag and loader script are rendered automatically.
- [ ] Replace `public/ads.txt` with the line AdSense gives you.
- [ ] In AdSense: Privacy & messaging, create the GDPR consent message (EEA/UK). It is served through the same loader tag, no extra code.
- [ ] Turn on Auto Ads, dynamic anchor ads, and Offerwall. Optionally create 3 manual units and fill the `SLOT_*` vars.
- [ ] After approval, check Core Web Vitals in Search Console; ad containers reserve height to keep CLS low.

## Structure

```
src/app/[locale]/           layout, home, tools/[slug], category/[category], about, contact, privacy, terms
src/app/sitemap.ts          from registry x locales
src/app/robots.ts
src/proxy.ts                next-intl locale routing
src/i18n/                   routing, navigation, request config
src/tools/                  registry, categories, types, one folder per tool
src/components/ads/         AdSenseScript (loader), AdSlot (CLS-safe unit)
src/components/seo/         JsonLd
src/components/tools/       ui primitives, ToolCard, ToolSearch, ToolArticle, RelatedTools
src/lib/site.ts             site + ads config from env
src/lib/seo.ts              canonical / hreflang helpers
messages/en.json            UI strings
```
