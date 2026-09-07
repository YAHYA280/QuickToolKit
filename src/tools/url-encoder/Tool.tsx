"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  Segmented,
  SelectField,
  TextArea,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";

type Mode = "encode" | "decode";
type Scope = "component" | "full";

const MODES: { value: Mode; label: string }[] = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
];

const SCOPES: { value: Scope; label: string }[] = [
  { value: "component", label: "Component (query value, path segment)" },
  { value: "full", label: "Full URL (keeps : / ? # & =)" },
];

function transform(input: string, mode: Mode, scope: Scope): string {
  if (mode === "encode") return scope === "component" ? encodeURIComponent(input) : encodeURI(input);
  return scope === "component" ? decodeURIComponent(input) : decodeURI(input);
}

function describeError(mode: Mode): string {
  return mode === "decode"
    ? "Malformed percent-encoding: every % must be followed by two hex digits (for example %20) and the bytes must form valid UTF-8."
    : "Input contains an unpaired surrogate character that cannot be encoded as UTF-8.";
}

export default function UrlEncoderTool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [scope, setScope] = useState<Scope>("component");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      return { output: transform(input, mode, scope), error: "" };
    } catch {
      return { output: "", error: describeError(mode) };
    }
  }, [input, mode, scope]);

  const swap = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const clear = () => setInput("");

  const fnName =
    mode === "encode"
      ? scope === "component"
        ? "encodeURIComponent"
        : "encodeURI"
      : scope === "component"
        ? "decodeURIComponent"
        : "decodeURI";

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented aria-label="Mode" value={mode} onChange={setMode} options={MODES} />
        <div className="flex items-center gap-2 text-sm">
          <Label htmlFor="url-scope" className="mb-0 text-muted-foreground">
            Scope
          </Label>
          <SelectField
            id="url-scope"
            size="sm"
            className="w-auto"
            value={scope}
            onChange={(v) => setScope(v as Scope)}
            options={SCOPES}
          />
        </div>
        <Chip className="text-muted-foreground">{fnName}()</Chip>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="url-in">{mode === "encode" ? "Plain text" : "Encoded text"}</Label>
          <TextArea
            id="url-in"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "https://example.com/search?q=café & crème"
                : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcaf%C3%A9%20%26%20cr%C3%A8me"
            }
            aria-invalid={Boolean(error) || undefined}
          />
          <ErrorText>{error}</ErrorText>
        </div>
        <div>
          <Label htmlFor="url-out">{mode === "encode" ? "Encoded text" : "Plain text"}</Label>
          <TextArea id="url-out" rows={10} value={output} readOnly placeholder="Result appears here" />
          {output && (
            <Hint>
              {input.length.toLocaleString()} characters in · {output.length.toLocaleString()} characters out
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
