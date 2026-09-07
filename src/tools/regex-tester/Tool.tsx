"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Button,
  CheckboxField,
  Chip,
  ErrorText,
  Hint,
  Label,
  Stat,
  TextArea,
  TextInput,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FLAGS = [
  { flag: "g", label: "global" },
  { flag: "i", label: "ignore case" },
  { flag: "m", label: "multiline" },
  { flag: "s", label: "dotAll" },
  { flag: "u", label: "unicode" },
] as const;

const MAX_MATCHES = 1000;

const QUICK_REFERENCE: { token: string; meaning: string }[] = [
  { token: "\\d", meaning: "Digit 0-9 (\\D for non-digit)" },
  { token: "\\w", meaning: "Word character: letter, digit or underscore (\\W for the opposite)" },
  { token: "\\s", meaning: "Whitespace: space, tab, newline (\\S for non-whitespace)" },
  { token: ".", meaning: "Any character except newline (newline too with the s flag)" },
  { token: "*", meaning: "Zero or more of the preceding item" },
  { token: "+", meaning: "One or more of the preceding item" },
  { token: "?", meaning: "Zero or one; after a quantifier makes it lazy (.*?)" },
  { token: "^", meaning: "Start of string (start of line with the m flag)" },
  { token: "$", meaning: "End of string (end of line with the m flag)" },
  { token: "[abc]", meaning: "Character class; [^abc] negates, [a-z] is a range" },
  { token: "(abc)", meaning: "Capture group; (?<name>abc) named, (?:abc) non-capturing" },
  { token: "a|b", meaning: "Alternation: match a or b" },
  { token: "{n,m}", meaning: "Between n and m repetitions; {n} exactly n, {n,} at least n" },
];

interface Match {
  index: number;
  text: string;
  groups: (string | undefined)[];
  named: [string, string | undefined][];
}

function toMatch(m: RegExpExecArray): Match {
  return {
    index: m.index,
    text: m[0],
    groups: m.slice(1),
    named: m.groups ? Object.entries(m.groups) : [],
  };
}

function findMatches(regex: RegExp, text: string): { matches: Match[]; truncated: boolean } {
  const matches: Match[] = [];
  if (!regex.global) {
    const m = regex.exec(text);
    if (m) matches.push(toMatch(m));
    return { matches, truncated: false };
  }
  regex.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    matches.push(toMatch(m));
    if (matches.length >= MAX_MATCHES) return { matches, truncated: true };
    if (m[0].length === 0) {
      // Zero-length match: exec() would return the same match forever unless we advance manually.
      const cp = text.codePointAt(regex.lastIndex);
      regex.lastIndex += regex.unicode && cp !== undefined && cp > 0xffff ? 2 : 1;
    }
  }
  return { matches, truncated: false };
}

function countGroups(regex: RegExp): number {
  const probe = new RegExp(`${regex.source}|`, regex.flags.replace("g", "").replace("y", ""));
  return (probe.exec("")?.length ?? 1) - 1;
}

function highlight(text: string, matches: Match[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.text.length === 0 || m.index < cursor) return;
    if (m.index > cursor) nodes.push(<span key={`t${i}`}>{text.slice(cursor, m.index)}</span>);
    nodes.push(
      <mark key={`m${i}`} className="rounded-sm bg-highlight text-highlight-foreground px-0.5 text-foreground">
        {m.text}
      </mark>,
    );
    cursor = m.index + m.text.length;
  });
  if (cursor < text.length) nodes.push(<span key="tail">{text.slice(cursor)}</span>);
  return nodes;
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("(?<user>\\w+)@(?<domain>\\w+\\.\\w+)");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact alice@example.com or bob@test.org for details.");

  const toggleFlag = (flag: string) =>
    setFlags((current) =>
      FLAGS.map((f) => f.flag)
        .filter((f) => (f === flag ? !current.includes(f) : current.includes(f)))
        .join(""),
    );

  const result = useMemo(() => {
    const empty = { error: "", matches: [] as Match[], truncated: false, groupCount: 0 };
    if (!pattern) return empty;
    try {
      const regex = new RegExp(pattern, flags);
      return { ...empty, groupCount: countGroups(regex), ...findMatches(regex, text) };
    } catch (e) {
      return { ...empty, error: e instanceof Error ? e.message : "Invalid regular expression" };
    }
  }, [pattern, flags, text]);

  const { error, matches, truncated, groupCount } = result;

  return (
    <ToolPanel>
      <Label htmlFor="regex-pattern">Pattern</Label>
      <div className="flex h-9 items-center rounded-lg border-2 border-border bg-card transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/20">
        <span className="ps-3 font-mono text-sm text-muted-foreground">/</span>
        <TextInput
          id="regex-pattern"
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          placeholder="[a-z]+"
          className="h-full rounded-none border-0 bg-transparent px-2 focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
        />
        <span className="pe-3 font-mono text-sm text-muted-foreground">/{flags}</span>
      </div>
      <ErrorText>{error}</ErrorText>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {FLAGS.map((f) => (
          <CheckboxField
            key={f.flag}
            id={`regex-flag-${f.flag}`}
            checked={flags.includes(f.flag)}
            onChange={() => toggleFlag(f.flag)}
            label={
              <>
                <span className="font-mono">{f.flag}</span> <span className="text-muted-foreground">{f.label}</span>
              </>
            }
          />
        ))}
      </div>

      <div className="mt-4">
        <Label htmlFor="regex-text">Test string</Label>
        <TextArea
          id="regex-text"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text to search"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          label="Matches"
          value={`${matches.length.toLocaleString()}${truncated ? "+" : ""}`}
          className="border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80"
        />
        <Stat label="Capture groups" value={String(groupCount)} />
        <Stat label="Flags" value={flags || "none"} />
      </div>

      <div className="mt-6">
        <p className="label-mono">Highlighted preview</p>
        <pre className="mt-2 max-h-64 overflow-auto brut-flat p-3 font-mono text-sm leading-relaxed break-words whitespace-pre-wrap">
          {text ? highlight(text, matches) : <span className="text-muted-foreground">Nothing to preview</span>}
        </pre>
      </div>

      {matches.length > 0 && (
        <div className="mt-6">
          <p className="label-mono">Match details</p>
          <div className="mt-2 max-h-80 overflow-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="label-mono">#</TableHead>
                  <TableHead className="label-mono">Index</TableHead>
                  <TableHead className="label-mono">Match</TableHead>
                  <TableHead className="label-mono">Groups</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {matches.map((m, i) => (
                  <TableRow key={`${m.index}-${i}`}>
                    <TableCell className="align-top text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="align-top">{m.index}</TableCell>
                    <TableCell className="align-top break-all whitespace-normal">
                      {m.text || <span className="text-muted-foreground">(empty)</span>}
                    </TableCell>
                    <TableCell className="align-top whitespace-normal">
                      {m.groups.length === 0 && <span className="text-muted-foreground">–</span>}
                      {m.groups.map((g, gi) => (
                        <div key={gi} className="break-all">
                          <span className="text-muted-foreground">${gi + 1}:</span>{" "}
                          {g ?? <span className="text-muted-foreground">undefined</span>}
                        </div>
                      ))}
                      {m.named.map(([name, value]) => (
                        <div key={name} className="break-all">
                          <span className="text-brand-strong">{name}:</span>{" "}
                          {value ?? <span className="text-muted-foreground">undefined</span>}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {truncated && <Hint>Showing the first {MAX_MATCHES.toLocaleString()} matches.</Hint>}
        </div>
      )}

      <ToolActions>
        <span className="flex-1" />
        <Button
          variant="ghost"
          onClick={() => {
            setPattern("");
            setText("");
          }}
        >
          Clear
        </Button>
      </ToolActions>

      <details className="mt-6 brut-flat">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium select-none">Quick reference</summary>
        <div className="border-t border-border">
          <Table>
            <TableBody className="text-[13px]">
              {QUICK_REFERENCE.map((row) => (
                <TableRow key={row.token}>
                  <TableCell className="w-28">
                    <Chip className="text-brand-strong">{row.token}</Chip>
                  </TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </details>
    </ToolPanel>
  );
}
