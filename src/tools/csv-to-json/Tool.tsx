"use client";

import { useMemo, useState } from "react";
import { DownloadIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  CodeBlock,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  Segmented,
  SelectField,
  Stat,
  TextArea,
  ToolActions,
  ToolPanel,
  cleanJsonError,
  locateJsonError,
} from "@/components/tools/ui";

type Direction = "csv2json" | "json2csv";
type DelimiterKey = "auto" | "comma" | "semicolon" | "tab" | "pipe";
type Shape = "objects" | "arrays" | "keyed";

const DELIMITERS: Record<Exclude<DelimiterKey, "auto">, string> = { comma: ",", semicolon: ";", tab: "\t", pipe: "|" };
const DELIMITER_NAMES: Record<string, string> = { ",": "comma", ";": "semicolon", "\t": "tab", "|": "pipe" };

const DELIMITER_OPTIONS = [
  { value: "auto", label: "Auto detect" },
  { value: "comma", label: "Comma ( , )" },
  { value: "semicolon", label: "Semicolon ( ; )" },
  { value: "tab", label: "Tab" },
  { value: "pipe", label: "Pipe ( | )" },
] as const;

const SHAPE_OPTIONS = [
  { value: "objects", label: "Array of objects" },
  { value: "arrays", label: "Array of arrays" },
  { value: "keyed", label: "Keyed by first column" },
] as const;

const SAMPLE_CSV = [
  "id,name,email,age,active",
  '1,"Ada Lovelace",ada@example.com,36,true',
  '2,"Grace Hopper",grace@example.com,85,true',
  '3,"Linus ""Tux"" Torvalds",linus@example.com,54,false',
  '4,"Smith, John",john@example.com,29,true',
].join("\n");

const SAMPLE_JSON = JSON.stringify(
  [
    { id: 1, name: "Ada Lovelace", email: "ada@example.com", age: 36, active: true },
    { id: 2, name: "Grace Hopper", email: "grace@example.com", age: 85, active: true },
    { id: 3, name: 'Linus "Tux" Torvalds', email: "linus@example.com", age: 54, active: false },
    { id: 4, name: "Smith, John", email: "john@example.com", age: 29, tags: ["new", "trial"] },
  ],
  null,
  2,
);

/* ------------------------------------------------------------------
   CSV parsing (RFC 4180: quoted fields, doubled quotes, newlines in quotes)
   ------------------------------------------------------------------ */

function detectDelimiter(text: string): string {
  const line = text.split(/\r?\n/).find((l) => l.trim()) ?? "";
  const counts: Record<string, number> = { ",": 0, ";": 0, "\t": 0, "|": 0 };
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch in counts) counts[ch]++;
  }
  let best = ",";
  let max = 0;
  for (const [d, n] of Object.entries(counts)) {
    if (n > max) {
      best = d;
      max = n;
    }
  }
  return best;
}

function parseCsv(text: string, delimiter: string): string[][] {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let line = 1;
  let recordLine = 1;
  let i = 0;
  const n = src.length;

  const endRow = () => {
    row.push(field);
    field = "";
    if (row.length > 1 || row[0] !== "") rows.push(row);
    row = [];
  };

  while (i < n) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
        continue;
      }
      if (ch === "\n") line++;
      field += ch;
      i++;
      continue;
    }
    if (ch === '"' && field === "") {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === delimiter) {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\r" || ch === "\n") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      i++;
      line++;
      endRow();
      recordLine = line;
      continue;
    }
    field += ch;
    i++;
  }
  if (inQuotes) throw new Error(`Unterminated quoted field in the record starting at line ${recordLine}`);
  if (field !== "" || row.length) endRow();
  return rows;
}

const NUMBER = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/;

function coerce(v: string): unknown {
  if (v === "") return null;
  const lower = v.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;
  if (NUMBER.test(v)) {
    const num = Number(v);
    if (Number.isFinite(num) && Math.abs(num) <= Number.MAX_SAFE_INTEGER) return num;
  }
  return v;
}

function uniqueKeys(headers: string[], width: number): string[] {
  const seen = new Map<string, number>();
  const keys: string[] = [];
  for (let i = 0; i < width; i++) {
    const base = (headers[i] ?? "").trim() || `column${i + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    keys.push(count ? `${base}_${count + 1}` : base);
  }
  return keys;
}

interface CsvResult {
  value: unknown;
  rows: number;
  columns: number;
  warnings: string[];
}

function csvToValue(rows: string[][], header: boolean, types: boolean, shape: Shape): CsvResult {
  const headers = header ? rows[0] : [];
  const data = header ? rows.slice(1) : rows;
  const width = Math.max(headers.length, ...data.map((r) => r.length));
  const keys = uniqueKeys(headers, width);
  const expected = header ? headers.length : (data[0]?.length ?? 0);
  const warnings: string[] = [];
  data.forEach((r, i) => {
    if (r.length !== expected && warnings.length < 5) {
      warnings.push(`Row ${i + 1 + (header ? 1 : 0)} has ${r.length} fields, expected ${expected}`);
    }
  });
  const conv = (v: string | undefined) => (types ? coerce(v ?? "") : (v ?? ""));

  let value: unknown;
  if (shape === "arrays") {
    value = data.map((r) => keys.map((_, i) => conv(r[i])));
  } else if (shape === "objects") {
    value = data.map((r) => Object.fromEntries(keys.map((k, i) => [k, conv(r[i])])));
  } else {
    const out: Record<string, unknown> = {};
    data.forEach((r, idx) => {
      const key = (r[0] ?? "").trim() || `row${idx + 1}`;
      out[key] = Object.fromEntries(keys.slice(1).map((k, i) => [k, conv(r[i + 1])]));
    });
    value = out;
  }
  return { value, rows: data.length, columns: width, warnings };
}

/* ------------------------------------------------------------------
   JSON -> CSV
   ------------------------------------------------------------------ */

function cellToString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function quoteCell(s: string, delimiter: string): string {
  return s.includes(delimiter) || s.includes('"') || /[\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function jsonToCsv(text: string, delimiter: string): { csv: string; rows: number; columns: number } {
  const parsed: unknown = JSON.parse(text);
  let list: unknown[];
  if (Array.isArray(parsed)) list = parsed;
  else if (parsed && typeof parsed === "object") list = [parsed];
  else throw new Error("Expected a JSON array of objects");
  if (!list.length) return { csv: "", rows: 0, columns: 0 };

  const isRecord = (v: unknown): v is Record<string, unknown> => Boolean(v) && typeof v === "object" && !Array.isArray(v);
  let header: string[] = [];
  let rows: unknown[][];
  if (list.every(isRecord)) {
    const keys = new Set<string>();
    for (const item of list) for (const k of Object.keys(item)) keys.add(k);
    header = [...keys];
    rows = list.map((item) => header.map((k) => item[k]));
  } else if (list.every(Array.isArray)) {
    rows = list as unknown[][];
  } else {
    header = ["value"];
    rows = list.map((v) => [v]);
  }
  const lines = header.length ? [header, ...rows] : rows;
  const csv = lines.map((r) => r.map((cell) => quoteCell(cellToString(cell), delimiter)).join(delimiter)).join("\n");
  const columns = Math.max(header.length, ...rows.map((r) => r.length));
  return { csv, rows: rows.length, columns };
}

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

interface Result {
  output: string;
  error: string;
  warnings: string[];
  rows: number;
  columns: number;
  delimiter: string;
}

const EMPTY: Result = { output: "", error: "", warnings: [], rows: 0, columns: 0, delimiter: "," };
const HIGHLIGHT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";

export default function CsvToJsonTool() {
  const [direction, setDirection] = useState<Direction>("csv2json");
  const [csvInput, setCsvInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [delimiterKey, setDelimiterKey] = useState<DelimiterKey>("auto");
  const [hasHeader, setHasHeader] = useState(true);
  const [types, setTypes] = useState(true);
  const [shape, setShape] = useState<Shape>("objects");
  const [loads, setLoads] = useState(0);

  const toJson = direction === "csv2json";
  const input = toJson ? csvInput : jsonInput;
  const setInput = toJson ? setCsvInput : setJsonInput;

  const result = useMemo<Result>(() => {
    if (!input.trim()) return EMPTY;
    const delimiter = delimiterKey === "auto" ? (toJson ? detectDelimiter(input) : ",") : DELIMITERS[delimiterKey];
    try {
      if (toJson) {
        const rows = parseCsv(input, delimiter);
        if (!rows.length) return { ...EMPTY, delimiter };
        const { value, rows: count, columns, warnings } = csvToValue(rows, hasHeader, types, shape);
        return { output: JSON.stringify(value, null, 2), error: "", warnings, rows: count, columns, delimiter };
      }
      const { csv, rows, columns } = jsonToCsv(input, delimiter);
      return { output: csv, error: "", warnings: [], rows, columns, delimiter };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Conversion failed";
      if (!toJson && e instanceof SyntaxError) {
        const pos = locateJsonError(message, input);
        return { ...EMPTY, delimiter, error: `${cleanJsonError(message)}${pos ? ` (line ${pos.line}, col ${pos.column})` : ""}` };
      }
      return { ...EMPTY, delimiter, error: message };
    }
  }, [input, toJson, delimiterKey, hasHeader, types, shape]);

  const { output, error, warnings, rows, columns, delimiter } = result;
  const bytes = new Blob([output]).size;

  const loadSample = () => {
    setInput(toJson ? SAMPLE_CSV : SAMPLE_JSON);
    setLoads((n) => n + 1);
  };

  const swap = () => {
    if (!output) return;
    if (toJson) {
      setJsonInput(output);
      setDirection("json2csv");
    } else {
      setCsvInput(output);
      setDirection("csv2json");
    }
    setLoads((n) => n + 1);
  };

  return (
    <ToolPanel>
      <Segmented
        aria-label="Direction"
        value={direction}
        onChange={setDirection}
        options={[
          { value: "csv2json", label: "CSV to JSON" },
          { value: "json2csv", label: "JSON to CSV" },
        ]}
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="csv-in" className="mb-0">
              {toJson ? "CSV input" : "JSON input"}
            </Label>
            <Button size="xs" variant="ghost" onClick={loadSample}>
              Sample
            </Button>
          </div>
          <TextArea
            id="csv-in"
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={toJson ? "id,name\n1,Ada\n2,Grace" : '[{"id": 1, "name": "Ada"}]'}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "csv-error" : undefined}
          />
          <ErrorText>{error && <span id="csv-error">{error}</span>}</ErrorText>
          {warnings.map((w) => (
            <Hint key={w} className="text-destructive">
              {w}
            </Hint>
          ))}
          {toJson && input.trim() && !error && delimiterKey === "auto" && (
            <Hint>Detected delimiter: {DELIMITER_NAMES[delimiter]}</Hint>
          )}
        </div>
        <div>
          <Label htmlFor="csv-out">{toJson ? "JSON output" : "CSV output"}</Label>
          {toJson ? (
            <CodeBlock
              id="csv-out"
              code={output}
              flashKey={loads}
              minHeight={14 * 22 + 24}
              placeholder="JSON appears here. Paste CSV or click Sample."
            />
          ) : (
            <TextArea
              id="csv-out"
              rows={14}
              readOnly
              value={output}
              flashKey={loads}
              placeholder="CSV appears here. Paste a JSON array or click Sample."
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Delimiter</span>
          <SelectField
            aria-label="Delimiter"
            size="sm"
            className="w-40"
            value={delimiterKey}
            onChange={(v) => setDelimiterKey(v as DelimiterKey)}
            options={DELIMITER_OPTIONS}
          />
        </div>
        {toJson && (
          <>
            <CheckboxField id="csv-header" checked={hasHeader} onChange={setHasHeader} label="First row is header" />
            <CheckboxField id="csv-types" checked={types} onChange={setTypes} label="Convert numbers and booleans" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Output</span>
              <SelectField
                aria-label="Output shape"
                size="sm"
                className="w-48"
                value={shape}
                onChange={(v) => setShape(v as Shape)}
                options={SHAPE_OPTIONS}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Rows" value={rows.toLocaleString()} className={HIGHLIGHT} />
        <Stat label="Columns" value={columns.toLocaleString()} />
        <Stat label="Bytes" value={bytes.toLocaleString()} />
      </div>

      <ToolActions>
        <CopyButton text={output} variant="primary" />
        <Button
          onClick={() =>
            download(output, toJson ? "data.json" : "data.csv", toJson ? "application/json" : "text/csv;charset=utf-8")
          }
          disabled={!output}
        >
          <DownloadIcon data-icon="inline-start" />
          Download {toJson ? ".json" : ".csv"}
        </Button>
        <Button variant="ghost" onClick={swap} disabled={!output}>
          {toJson ? "Convert back to CSV" : "Convert back to JSON"}
        </Button>
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => setInput("")}>
          Clear
        </Button>
      </ToolActions>
    </ToolPanel>
  );
}
