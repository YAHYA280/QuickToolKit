"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRightIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  CopyButton,
  Hint,
  Label,
  Segmented,
  SelectField,
  Stat,
  TextArea,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";

type Mode = "encode" | "decode";
type Format = "named" | "decimal" | "hex";

const MODES: { value: Mode; label: string }[] = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
];

const FORMATS: { value: Format; label: string }[] = [
  { value: "named", label: "Named where possible (&amp; &lt; &eacute;)" },
  { value: "decimal", label: "Numeric decimal (&#233;)" },
  { value: "hex", label: "Hex (&#xE9;)" },
];

/** Code point -> entity name for the HTML 4 / Latin-1 set plus popular symbols. */
const ENTITIES: [number, string][] = [
  [0x26, "amp"], [0x3c, "lt"], [0x3e, "gt"], [0x22, "quot"], [0x27, "apos"],
  [0xa0, "nbsp"], [0xa1, "iexcl"], [0xa2, "cent"], [0xa3, "pound"], [0xa4, "curren"], [0xa5, "yen"],
  [0xa6, "brvbar"], [0xa7, "sect"], [0xa8, "uml"], [0xa9, "copy"], [0xaa, "ordf"], [0xab, "laquo"],
  [0xac, "not"], [0xad, "shy"], [0xae, "reg"], [0xaf, "macr"], [0xb0, "deg"], [0xb1, "plusmn"],
  [0xb2, "sup2"], [0xb3, "sup3"], [0xb4, "acute"], [0xb5, "micro"], [0xb6, "para"], [0xb7, "middot"],
  [0xb8, "cedil"], [0xb9, "sup1"], [0xba, "ordm"], [0xbb, "raquo"], [0xbc, "frac14"], [0xbd, "frac12"],
  [0xbe, "frac34"], [0xbf, "iquest"],
  [0xc0, "Agrave"], [0xc1, "Aacute"], [0xc2, "Acirc"], [0xc3, "Atilde"], [0xc4, "Auml"], [0xc5, "Aring"],
  [0xc6, "AElig"], [0xc7, "Ccedil"], [0xc8, "Egrave"], [0xc9, "Eacute"], [0xca, "Ecirc"], [0xcb, "Euml"],
  [0xcc, "Igrave"], [0xcd, "Iacute"], [0xce, "Icirc"], [0xcf, "Iuml"], [0xd0, "ETH"], [0xd1, "Ntilde"],
  [0xd2, "Ograve"], [0xd3, "Oacute"], [0xd4, "Ocirc"], [0xd5, "Otilde"], [0xd6, "Ouml"], [0xd7, "times"],
  [0xd8, "Oslash"], [0xd9, "Ugrave"], [0xda, "Uacute"], [0xdb, "Ucirc"], [0xdc, "Uuml"], [0xdd, "Yacute"],
  [0xde, "THORN"], [0xdf, "szlig"],
  [0xe0, "agrave"], [0xe1, "aacute"], [0xe2, "acirc"], [0xe3, "atilde"], [0xe4, "auml"], [0xe5, "aring"],
  [0xe6, "aelig"], [0xe7, "ccedil"], [0xe8, "egrave"], [0xe9, "eacute"], [0xea, "ecirc"], [0xeb, "euml"],
  [0xec, "igrave"], [0xed, "iacute"], [0xee, "icirc"], [0xef, "iuml"], [0xf0, "eth"], [0xf1, "ntilde"],
  [0xf2, "ograve"], [0xf3, "oacute"], [0xf4, "ocirc"], [0xf5, "otilde"], [0xf6, "ouml"], [0xf7, "divide"],
  [0xf8, "oslash"], [0xf9, "ugrave"], [0xfa, "uacute"], [0xfb, "ucirc"], [0xfc, "uuml"], [0xfd, "yacute"],
  [0xfe, "thorn"], [0xff, "yuml"],
  [0x152, "OElig"], [0x153, "oelig"], [0x160, "Scaron"], [0x161, "scaron"], [0x178, "Yuml"], [0x192, "fnof"],
  [0x2c6, "circ"], [0x2dc, "tilde"],
  [0x2013, "ndash"], [0x2014, "mdash"], [0x2018, "lsquo"], [0x2019, "rsquo"], [0x201a, "sbquo"],
  [0x201c, "ldquo"], [0x201d, "rdquo"], [0x201e, "bdquo"], [0x2020, "dagger"], [0x2021, "Dagger"],
  [0x2022, "bull"], [0x2026, "hellip"], [0x2030, "permil"], [0x2032, "prime"], [0x2033, "Prime"],
  [0x2039, "lsaquo"], [0x203a, "rsaquo"], [0x2044, "frasl"], [0x20ac, "euro"], [0x2122, "trade"],
  [0x2190, "larr"], [0x2191, "uarr"], [0x2192, "rarr"], [0x2193, "darr"], [0x2194, "harr"],
  [0x2202, "part"], [0x2205, "empty"], [0x2208, "isin"], [0x220f, "prod"], [0x2211, "sum"],
  [0x2212, "minus"], [0x221a, "radic"], [0x221e, "infin"], [0x2229, "cap"], [0x222a, "cup"],
  [0x2248, "asymp"], [0x2260, "ne"], [0x2261, "equiv"], [0x2264, "le"], [0x2265, "ge"],
  [0x25ca, "loz"], [0x2660, "spades"], [0x2663, "clubs"], [0x2665, "hearts"], [0x2666, "diams"],
  [0x391, "Alpha"], [0x392, "Beta"], [0x393, "Gamma"], [0x394, "Delta"], [0x398, "Theta"], [0x39b, "Lambda"],
  [0x3a0, "Pi"], [0x3a3, "Sigma"], [0x3a6, "Phi"], [0x3a9, "Omega"],
  [0x3b1, "alpha"], [0x3b2, "beta"], [0x3b3, "gamma"], [0x3b4, "delta"], [0x3b5, "epsilon"], [0x3b8, "theta"],
  [0x3bb, "lambda"], [0x3bc, "mu"], [0x3c0, "pi"], [0x3c3, "sigma"], [0x3c4, "tau"], [0x3c6, "phi"], [0x3c9, "omega"],
];

const CODE_TO_NAME = new Map<number, string>(ENTITIES);
const NAME_TO_CODE = new Map<string, number>(ENTITIES.map(([code, name]) => [name, code]));
// HTML5 also accepts these legacy upper-case aliases.
NAME_TO_CODE.set("QUOT", 0x22);
NAME_TO_CODE.set("AMP", 0x26);
NAME_TO_CODE.set("LT", 0x3c);
NAME_TO_CODE.set("GT", 0x3e);

const RESERVED = new Set([0x26, 0x3c, 0x3e, 0x22, 0x27]);

function encodeEntities(text: string, format: Format, minimal: boolean): { output: string; count: number } {
  let output = "";
  let count = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    const encode = RESERVED.has(cp) || (!minimal && cp >= 0x80);
    if (!encode) {
      output += ch;
      continue;
    }
    count++;
    const name = format === "named" ? CODE_TO_NAME.get(cp) : undefined;
    if (name) output += "&" + name + ";";
    else if (format === "hex") output += "&#x" + cp.toString(16).toUpperCase() + ";";
    else output += "&#" + cp + ";";
  }
  return { output, count };
}

const ENTITY_RE = /&(?:#[xX]([0-9a-fA-F]{1,6})|#([0-9]{1,7})|([A-Za-z][A-Za-z0-9]{1,31}));/g;

/** Pure-string decoder: never touches the DOM. Unknown names are left untouched. */
function decodeEntities(text: string): { output: string; count: number } {
  let count = 0;
  const output = text.replace(
    ENTITY_RE,
    (match: string, hex: string | undefined, dec: string | undefined, name: string | undefined) => {
      let cp: number | undefined;
      if (hex) cp = parseInt(hex, 16);
      else if (dec) cp = parseInt(dec, 10);
      else if (name) cp = NAME_TO_CODE.get(name);
      if (cp === undefined || cp === 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) return match;
      count++;
      return String.fromCodePoint(cp);
    },
  );
  return { output, count };
}

const TABLE_CODES = [
  0x26, 0x3c, 0x3e, 0x22, 0x27, 0xa0, 0xa9, 0xae, 0x2122, 0x20ac, 0xa3, 0xa5, 0xa2, 0xb0, 0xb1, 0xd7, 0xf7, 0xe9,
  0xfc, 0xf1, 0x2026, 0x2013, 0x2014, 0x201c, 0x201d, 0x2022, 0xab, 0xbb,
];

const PLACEHOLDER_ENCODE = "<a href=\"/search?q=café&lang=fr\">Café & Crème © 2026</a>";
const PLACEHOLDER_DECODE = "&lt;p&gt;Tom &amp; Jerry &copy; 2026 &#8211; caf&eacute; &#x2014; &quot;done&quot;&lt;/p&gt;";

export default function HtmlEntityEncoderTool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [format, setFormat] = useState<Format>("named");
  const [minimal, setMinimal] = useState(false);
  const [input, setInput] = useState("");

  const { output, count } = useMemo(() => {
    if (!input) return { output: "", count: 0 };
    return mode === "encode" ? encodeEntities(input, format, minimal) : decodeEntities(input);
  }, [input, mode, format, minimal]);

  const swap = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented aria-label="Mode" value={mode} onChange={setMode} options={MODES} />
        {mode === "encode" && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Format</span>
              <SelectField
                aria-label="Entity format"
                size="sm"
                className="w-72 max-w-full"
                value={format}
                onChange={(v) => setFormat(v as Format)}
                options={FORMATS}
              />
            </div>
            <CheckboxField
              id="ent-minimal"
              checked={minimal}
              onChange={setMinimal}
              label={"Only encode & < > \" ' (untick to encode all non-ASCII)"}
            />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="ent-in">{mode === "encode" ? "Text or HTML" : "Encoded HTML"}</Label>
          <TextArea
            id="ent-in"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? PLACEHOLDER_ENCODE : PLACEHOLDER_DECODE}
          />
          <Hint>
            {mode === "encode"
              ? minimal
                ? "Escapes the five reserved characters. Accented letters and symbols are left as they are."
                : "Escapes the reserved characters plus every character above U+007F."
              : "Handles named (&copy;), decimal (&#169;) and hex (&#xA9;) references. Unknown names are left untouched."}
          </Hint>
        </div>
        <div>
          <Label htmlFor="ent-out">{mode === "encode" ? "Encoded" : "Decoded"}</Label>
          <TextArea
            id="ent-out"
            rows={10}
            value={output}
            readOnly
            placeholder={mode === "encode" ? "Entities appear here" : "Plain text appears here"}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Input chars" value={input.length.toLocaleString()} />
        <Stat label="Output chars" value={output.length.toLocaleString()} />
        <Stat label={mode === "encode" ? "Entities written" : "Entities decoded"} value={count.toLocaleString()} />
      </div>

      <ToolActions>
        <CopyButton text={output} variant="primary" />
        <Button onClick={swap} disabled={!output}>
          <ArrowLeftRightIcon data-icon="inline-start" />
          Swap
        </Button>
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => setInput("")} disabled={!input}>
          Clear
        </Button>
      </ToolActions>

      <div className="mt-8">
        <p className="label-mono mb-2">Common entities</p>
        <div className="overflow-x-auto border-2 border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="px-3 py-2 text-start font-bold">Char</th>
                <th className="px-3 py-2 text-start font-bold">Named</th>
                <th className="px-3 py-2 text-start font-bold">Decimal</th>
                <th className="px-3 py-2 text-start font-bold">Hex</th>
                <th className="px-3 py-2 text-start font-bold">Name</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              {TABLE_CODES.map((cp) => {
                const name = CODE_TO_NAME.get(cp) ?? "";
                return (
                  <tr key={cp} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-1.5 text-base">{cp === 0xa0 ? "(space)" : String.fromCodePoint(cp)}</td>
                    <td className="px-3 py-1.5">&amp;{name};</td>
                    <td className="px-3 py-1.5">&amp;#{cp};</td>
                    <td className="px-3 py-1.5">&amp;#x{cp.toString(16).toUpperCase()};</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ToolPanel>
  );
}
