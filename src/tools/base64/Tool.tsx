"use client";

import { useMemo, useState } from "react";
import {
  Button,
  CheckboxField,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  Segmented,
  TextArea,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";

type Mode = "encode" | "decode";

const MODES: { value: Mode; label: string }[] = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
];

function bytesToBinary(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return binary;
}

function encode(text: string, urlSafe: boolean): string {
  const b64 = btoa(bytesToBinary(new TextEncoder().encode(text)));
  return urlSafe ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b64;
}

function decode(input: string): string {
  let s = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) {
    throw new Error("Input contains characters that are not part of the Base64 alphabet.");
  }
  const rem = s.length % 4;
  if (rem === 1) throw new Error("Invalid Base64: the length cannot be one more than a multiple of four.");
  if (rem) s += "=".repeat(4 - rem);
  const binary = atob(s);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      return { output: mode === "encode" ? encode(input, urlSafe) : decode(input), error: "" };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid Base64 input." };
    }
  }, [input, mode, urlSafe]);

  const swap = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const clear = () => setInput("");

  const inputBytes = new Blob([input]).size;

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented aria-label="Mode" value={mode} onChange={setMode} options={MODES} />
        <CheckboxField
          id="b64-urlsafe"
          checked={urlSafe}
          onChange={setUrlSafe}
          label="URL-safe alphabet (- _ and no padding)"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="b64-in">{mode === "encode" ? "Text" : "Base64"}</Label>
          <TextArea
            id="b64-in"
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ=="}
            aria-invalid={Boolean(error) || undefined}
          />
          <ErrorText>{error}</ErrorText>
        </div>
        <div>
          <Label htmlFor="b64-out">{mode === "encode" ? "Base64" : "Text"}</Label>
          <TextArea
            id="b64-out"
            rows={12}
            value={output}
            readOnly
            placeholder={mode === "encode" ? "Encoded output appears here" : "Decoded text appears here"}
          />
          {output && (
            <Hint>
              {inputBytes.toLocaleString()} bytes in · {output.length.toLocaleString()} characters out
            </Hint>
          )}
        </div>
      </div>

      <ToolActions>
        <CopyButton text={output} />
        <Button onClick={swap} disabled={!output}>
          Swap
        </Button>
        <span className="flex-1" />
        <Button variant="ghost" onClick={clear} disabled={!input}>
          Clear
        </Button>
      </ToolActions>
    </ToolPanel>
  );
}
