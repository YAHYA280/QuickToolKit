"use client";

import { useRef, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  CodeBlock,
  CopyButton,
  ErrorText,
  Hint,
  KbdHint,
  Label,
  SelectField,
  TextArea,
  ToolActions,
  ToolPanel,
  cleanJsonError,
  locateJsonError,
  useHotkey,
  type ParsePosition,
} from "@/components/tools/ui";

type Indent = "2" | "4" | "tab";

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

function countKeys(value: unknown): number {
  if (Array.isArray(value)) return value.reduce<number>((n, v) => n + countKeys(v), 0);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).reduce<number>((n, v) => n + 1 + countKeys(v), 0);
  }
  return 0;
}

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [errorPos, setErrorPos] = useState<ParsePosition | null>(null);
  const [indent, setIndent] = useState<Indent>("2");
  const [sorted, setSorted] = useState(false);
  const [formatOnPaste, setFormatOnPaste] = useState(true);
  const [keys, setKeys] = useState(0);
  const [runs, setRuns] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const run = (mode: "format" | "minify", source = input) => {
    if (!source.trim()) {
      setOutput("");
      setError("");
      setErrorPos(null);
      return;
    }
    try {
      const value = JSON.parse(source);
      const data = sorted ? sortKeys(value) : value;
      const space = mode === "minify" ? undefined : indent === "tab" ? "\t" : Number(indent);
      setOutput(JSON.stringify(data, null, space));
      setKeys(countKeys(value));
      setError("");
      setErrorPos(null);
      setRuns((n) => n + 1);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid JSON";
      setError(cleanJsonError(message));
      setErrorPos(locateJsonError(message, source));
      setOutput("");
    }
  };

  useHotkey("mod+enter", () => run("format"));

  const jumpToError = () => {
    const el = inputRef.current;
    if (!el || !errorPos) return;
    el.focus();
    el.setSelectionRange(errorPos.offset, Math.min(errorPos.offset + 1, el.value.length));
    const lineHeight = 22;
    el.scrollTop = Math.max(0, (errorPos.line - 3) * lineHeight);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
    setErrorPos(null);
    inputRef.current?.focus();
  };

  const useOutput = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
  };

  const size = new Blob([output]).size;

  return (
    <ToolPanel>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="json-in" className="mb-0">
              Input
            </Label>
            {input && (
              <Hint className="mt-0">
                {input.length.toLocaleString()} chars
              </Hint>
            )}
          </div>
          <TextArea
            ref={inputRef}
            id="json-in"
            rows={16}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={(e) => {
              if (!formatOnPaste) return;
              const pasted = e.clipboardData.getData("text");
              if (!pasted.trim()) return;
              e.preventDefault();
              setInput(pasted);
              run("format", pasted);
            }}
            placeholder='{"name": "Ada", "langs": ["ts", "js"]}'
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "json-error" : undefined}
          />
          <ErrorText
            action={
              errorPos && (
                <Button size="xs" variant="ghost" onClick={jumpToError} className="text-destructive">
                  Jump to line {errorPos.line}
                </Button>
              )
            }
          >
            {error && (
              <span id="json-error">
                {error}
                {errorPos && (
                  <span className="text-destructive/70">
                    {" "}
                    · line {errorPos.line}, col {errorPos.column}
                  </span>
                )}
              </span>
            )}
          </ErrorText>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="json-out" className="mb-0">
              Output
            </Label>
            {output && (
              <Hint className="mt-0">
                {size.toLocaleString()} B · {output.split("\n").length.toLocaleString()} lines · {keys.toLocaleString()} keys
              </Hint>
            )}
          </div>
          <CodeBlock
            id="json-out"
            code={output}
            flashKey={runs}
            minHeight={16 * 22 + 24}
            placeholder="Formatted JSON appears here. Paste JSON or press Ctrl+Enter."
          />
        </div>
      </div>

      <ToolActions>
        <Button variant="primary" onClick={() => run("format")}>
          Format
          <KbdHint combo="mod+enter" />
        </Button>
        <Button onClick={() => run("minify")}>Minify</Button>
        <Button variant="ghost" onClick={useOutput} disabled={!output} aria-label="Use output as input">
          <ArrowLeftIcon data-icon="inline-start" className="rtl:rotate-180" />
          Use as input
        </Button>
        <div className="ms-1 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Indent</span>
          <SelectField
            aria-label="Indent size"
            size="sm"
            className="w-28"
            value={indent}
            onChange={(v) => setIndent(v as Indent)}
            options={[
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
              { value: "tab", label: "Tab" },
            ]}
          />
        </div>
        <CheckboxField id="json-sort" checked={sorted} onChange={setSorted} label="Sort keys" />
        <CheckboxField id="json-paste" checked={formatOnPaste} onChange={setFormatOnPaste} label="Format on paste" />
        <span className="flex-1" />
        <CopyButton text={output} />
        <Button variant="ghost" onClick={clear}>
          Clear
        </Button>
      </ToolActions>
    </ToolPanel>
  );
}
