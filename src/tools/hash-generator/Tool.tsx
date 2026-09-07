"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  CheckboxField,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  TextArea,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";
import { md5 } from "./md5";

const SHA_ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type ShaAlgo = (typeof SHA_ALGOS)[number];

const BITS: Record<"MD5" | ShaAlgo, number> = { MD5: 128, "SHA-1": 160, "SHA-256": 256, "SHA-384": 384, "SHA-512": 512 };

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [upper, setUpper] = useState(false);
  const [sha, setSha] = useState<Record<ShaAlgo, string> | null>(null);
  const [error, setError] = useState("");

  const md5Hex = useMemo(() => md5(input), [input]);
  const byteLength = useMemo(() => new TextEncoder().encode(input).length, [input]);

  useEffect(() => {
    let cancelled = false;
    const bytes = new TextEncoder().encode(input);
    // Wrapping in a resolved promise turns a missing crypto.subtle into a rejection instead of a throw.
    Promise.resolve()
      .then(() => Promise.all(SHA_ALGOS.map((algo) => crypto.subtle.digest(algo, bytes).then(toHex))))
      .then(([sha1, sha256, sha384, sha512]) => {
        if (cancelled) return;
        setSha({ "SHA-1": sha1, "SHA-256": sha256, "SHA-384": sha384, "SHA-512": sha512 });
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setSha(null);
        setError("Web Crypto is unavailable. SHA hashes need a secure context (HTTPS or localhost).");
      });
    return () => {
      cancelled = true;
    };
  }, [input]);

  const rows: { name: "MD5" | ShaAlgo; value: string }[] = [
    { name: "MD5", value: md5Hex },
    ...SHA_ALGOS.map((algo) => ({ name: algo, value: sha?.[algo] ?? "" })),
  ];

  return (
    <ToolPanel>
      <Label htmlFor="hash-in">Input text</Label>
      <TextArea
        id="hash-in"
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to hash"
      />
      <Hint>
        {input.length.toLocaleString()} characters · {byteLength.toLocaleString()} bytes (UTF-8)
      </Hint>

      <ToolActions>
        <CheckboxField id="hash-upper" checked={upper} onChange={setUpper} label="Uppercase hex" />
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => setInput("")} disabled={!input}>
          Clear
        </Button>
      </ToolActions>
      <ErrorText>{error}</ErrorText>

      <div className="mt-4 space-y-2">
        {rows.map((row) => {
          const display = upper ? row.value.toUpperCase() : row.value;
          return (
            <div
              key={row.name}
              className="flex items-center justify-between gap-3 brut-flat px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="label-mono">
                  {row.name} · {BITS[row.name]}-bit
                </p>
                <p className="mt-1 break-all font-mono text-sm">
                  {display || <span className="text-muted-foreground">Computing…</span>}
                </p>
              </div>
              <CopyButton text={display} size="sm" className="shrink-0" />
            </div>
          );
        })}
      </div>
    </ToolPanel>
  );
}
