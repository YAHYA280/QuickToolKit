"use client";

import { useEffect, useState } from "react";
import {
  Button,
  CheckboxField,
  CopyButton,
  Hint,
  Label,
  NumberInput,
  TextArea,
  ToolActions,
  ToolPanel,
  useCopy,
} from "@/components/tools/ui";

const MAX = 1000;

function uuidV4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidGeneratorTool() {
  const [count, setCount] = useState<number | "">(10);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [quotes, setQuotes] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [quick, setQuick] = useState("");
  const { copied, copy } = useCopy();

  // Generate after mount so the server-rendered markup matches the client on hydration.
  useEffect(() => {
    const id = window.setTimeout(() => setQuick(uuidV4()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const format = (u: string) => {
    let s = noHyphens ? u.replace(/-/g, "") : u;
    if (uppercase) s = s.toUpperCase();
    return quotes ? `"${s}"` : s;
  };

  const output = list.map(format).join("\n");
  const quickText = quick ? format(quick) : "";

  const generate = () => {
    const n = Math.min(MAX, Math.max(1, Math.floor(Number(count) || 1)));
    setList(Array.from({ length: n }, () => uuidV4()));
  };

  return (
    <ToolPanel>
      <div className="rounded-lg border border-brand/40 bg-brand/5 px-4 py-3">
        <p className="label-mono">Quick copy</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => copy(quickText)}
            disabled={!quickText}
            title="Click to copy"
            className="-mx-2 rounded-md px-2 py-1 text-left font-mono text-lg font-medium tabular-nums break-all transition-colors hover:bg-accent disabled:text-muted-foreground sm:text-2xl"
          >
            {quickText || "Generating..."}
          </button>
          <span className="flex-1" />
          <span className={`font-mono text-[11px] ${copied ? "text-success" : "text-muted-foreground"}`} aria-live="polite">
            {copied ? "Copied" : "Click the UUID to copy"}
          </span>
          <Button size="sm" onClick={() => setQuick(uuidV4())}>
            New
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div className="w-32">
          <Label htmlFor="uuid-count">Count</Label>
          <NumberInput id="uuid-count" value={count} onChange={setCount} min={1} max={MAX} step={1} />
        </div>
        <CheckboxField id="uuid-upper" className="pb-2" checked={uppercase} onChange={setUppercase} label="Uppercase" />
        <CheckboxField
          id="uuid-nohyphens"
          className="pb-2"
          checked={noHyphens}
          onChange={setNoHyphens}
          label="Remove hyphens"
        />
        <CheckboxField id="uuid-quotes" className="pb-2" checked={quotes} onChange={setQuotes} label="Wrap in quotes" />
      </div>

      <div className="mt-4">
        <Label htmlFor="uuid-out">Generated UUIDs</Label>
        <TextArea
          id="uuid-out"
          rows={10}
          value={output}
          readOnly
          placeholder="Click Generate to create a list of UUIDs, one per line"
        />
        {list.length > 0 && <Hint>{list.length.toLocaleString()} UUIDs · one per line</Hint>}
      </div>

      <ToolActions>
        <Button variant="primary" onClick={generate}>
          Generate
        </Button>
        <CopyButton text={output} />
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => setList([])} disabled={list.length === 0}>
          Clear
        </Button>
      </ToolActions>
    </ToolPanel>
  );
}
