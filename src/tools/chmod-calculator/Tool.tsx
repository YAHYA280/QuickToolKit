"use client";

import { useState } from "react";
import { TriangleAlertIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  Chip,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  Stat,
  TextInput,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CLASSES = [
  { key: "owner", label: "Owner", short: "u", shift: 6, special: 0o4000 },
  { key: "group", label: "Group", short: "g", shift: 3, special: 0o2000 },
  { key: "others", label: "Others", short: "o", shift: 0, special: 0o1000 },
] as const;

const PERMS = [
  { key: "read", label: "Read", bit: 4 },
  { key: "write", label: "Write", bit: 2 },
  { key: "execute", label: "Execute", bit: 1 },
] as const;

const SPECIAL = [
  { key: "setuid", label: "Setuid", bit: 0o4000, hint: "run as the file owner" },
  { key: "setgid", label: "Setgid", bit: 0o2000, hint: "run as group, dirs inherit group" },
  { key: "sticky", label: "Sticky", bit: 0o1000, hint: "only owners delete inside the dir" },
] as const;

const COMMON = [
  { octal: "644", use: "Regular files: HTML, images, configs. Owner edits, everyone else reads." },
  { octal: "755", use: "Directories, scripts and binaries. Everyone can enter or run, only the owner writes." },
  { octal: "600", use: "Private files: SSH private keys, .env files, database credentials." },
  { octal: "700", use: "Private directories such as ~/.ssh, or scripts only you may run." },
  { octal: "664", use: "Group editable files in a shared project folder." },
  { octal: "775", use: "Group editable directories, for example a deploy folder shared by a team." },
  { octal: "777", use: "Anyone on the machine can read, modify and execute. Avoid on servers.", warn: true },
] as const;

const SYMBOLIC = /^([r-])([w-])([xsS-])([r-])([w-])([xsS-])([r-])([w-])([xtT-])$/;
const TYPE_CHARS = "-dlcbps";

function toOctal(bits: number): string {
  return bits.toString(8).padStart(3, "0");
}

function toSymbolic(bits: number): string {
  return CLASSES.map((cls) => {
    const r = bits & (4 << cls.shift) ? "r" : "-";
    const w = bits & (2 << cls.shift) ? "w" : "-";
    const x = Boolean(bits & (1 << cls.shift));
    const special = Boolean(bits & cls.special);
    const letter = cls.key === "others" ? "t" : "s";
    const last = special ? (x ? letter : letter.toUpperCase()) : x ? "x" : "-";
    return r + w + last;
  }).join("");
}

function parseOctal(text: string): number | null {
  return /^[0-7]{3,4}$/.test(text) ? parseInt(text, 8) : null;
}

function parseSymbolic(text: string): number | null {
  let s = text.trim();
  if (s.length === 10 && TYPE_CHARS.includes(s[0])) s = s.slice(1);
  const m = SYMBOLIC.exec(s);
  if (!m) return null;
  let bits = 0;
  CLASSES.forEach((cls, i) => {
    const [r, w, x] = m.slice(1 + i * 3, 4 + i * 3);
    if (r === "r") bits |= 4 << cls.shift;
    if (w === "w") bits |= 2 << cls.shift;
    if (x === "x" || x === "s" || x === "t") bits |= 1 << cls.shift;
    if (x === "s" || x === "S" || x === "t" || x === "T") bits |= cls.special;
  });
  return bits;
}

function describeClass(bits: number, shift: number): string {
  const names = PERMS.filter((p) => bits & (p.bit << shift)).map((p) => p.label.toLowerCase());
  return names.length ? names.join(", ") : "no access";
}

const HIGHLIGHT = "border-primary bg-primary text-primary-foreground [&_.label-mono]:text-primary-foreground/80";

export default function ChmodCalculatorTool() {
  const [bits, setBits] = useState(0o755);
  const [octalText, setOctalText] = useState("755");
  const [symText, setSymText] = useState("rwxr-xr-x");
  const [octalError, setOctalError] = useState("");
  const [symError, setSymError] = useState("");
  const [target, setTarget] = useState("file");

  const commit = (next: number) => {
    setBits(next);
    setOctalText(toOctal(next));
    setSymText(toSymbolic(next));
    setOctalError("");
    setSymError("");
  };

  const toggle = (bit: number, on: boolean) => commit(on ? bits | bit : bits & ~bit);

  const onOctal = (text: string) => {
    setOctalText(text);
    const parsed = parseOctal(text.trim());
    if (parsed === null) {
      setOctalError(text.trim() ? "Enter 3 or 4 octal digits, each 0-7, for example 755 or 4755" : "");
      return;
    }
    setOctalError("");
    setSymError("");
    setBits(parsed);
    setSymText(toSymbolic(parsed));
  };

  const onSymbolic = (text: string) => {
    setSymText(text);
    const parsed = parseSymbolic(text);
    if (parsed === null) {
      setSymError(text.trim() ? "Use 9 characters like rwxr-xr-x (s, S, t and T are allowed in the execute slots)" : "");
      return;
    }
    setSymError("");
    setOctalError("");
    setBits(parsed);
    setOctalText(toOctal(parsed));
  };

  const octal = toOctal(bits);
  const symbolic = toSymbolic(bits);
  const command = `chmod ${octal} ${target.trim() || "file"}`;
  const worldWritable = (bits & 0o002) !== 0;

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div>
          <p className="label-mono">Permissions</p>
          <div className="mt-2 brut-flat overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-start label-mono">Who</th>
                  {PERMS.map((p) => (
                    <th key={p.key} className="px-3 py-2 text-start label-mono">
                      {p.label} <span className="text-muted-foreground">({p.bit})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLASSES.map((cls) => (
                  <tr key={cls.key} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">
                      {cls.label} <span className="font-mono text-xs text-muted-foreground">{cls.short}</span>
                    </td>
                    {PERMS.map((p) => {
                      const bit = p.bit << cls.shift;
                      return (
                        <td key={p.key} className="px-3 py-2">
                          <CheckboxField
                            id={`chmod-${cls.key}-${p.key}`}
                            checked={(bits & bit) !== 0}
                            onChange={(v) => toggle(bit, v)}
                            label={<span className="sr-only">{`${cls.label} ${p.label}`}</span>}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 label-mono">Special bits</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {SPECIAL.map((s) => (
              <CheckboxField
                key={s.key}
                id={`chmod-${s.key}`}
                checked={(bits & s.bit) !== 0}
                onChange={(v) => toggle(s.bit, v)}
                label={
                  <>
                    {s.label} <span className="text-muted-foreground">({s.hint})</span>
                  </>
                }
              />
            ))}
          </div>
        </div>

        <div className="grid content-start gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="chmod-octal">Octal</Label>
            <TextInput
              id="chmod-octal"
              value={octalText}
              onChange={(e) => onOctal(e.target.value)}
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              aria-invalid={Boolean(octalError) || undefined}
              className="h-11 text-lg font-bold"
            />
            <ErrorText>{octalError}</ErrorText>
            {!octalError && <Hint>3 digits, or 4 with setuid, setgid or sticky.</Hint>}
          </div>
          <div>
            <Label htmlFor="chmod-symbolic">Symbolic</Label>
            <TextInput
              id="chmod-symbolic"
              value={symText}
              onChange={(e) => onSymbolic(e.target.value)}
              maxLength={10}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={Boolean(symError) || undefined}
              className="h-11 text-lg font-bold"
            />
            <ErrorText>{symError}</ErrorText>
            {!symError && <Hint>As shown by ls -l, with or without the leading type character.</Hint>}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="chmod-target">Target (file or directory name)</Label>
            <TextInput id="chmod-target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="file" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Octal" value={octal} className={HIGHLIGHT} />
        <Stat label="Symbolic" value={symbolic} />
        <div className="min-w-0 brut-flat px-4 py-3">
          <p className="label-mono">Command</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <code className="truncate font-mono text-lg font-bold">{command}</code>
            <CopyButton text={command} size="sm" />
          </div>
        </div>
      </div>

      <Hint>
        {CLASSES.map((cls, i) => (
          <span key={cls.key}>
            {i > 0 && " · "}
            {cls.label}: <span className="text-foreground">{describeClass(bits, cls.shift)}</span>
          </span>
        ))}
      </Hint>
      {worldWritable && (
        <p className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <TriangleAlertIcon className="size-4 shrink-0" />
          Others can write to this path. Any user or process on the machine can modify it.
        </p>
      )}

      <ToolActions>
        <CopyButton text={command} label="Copy command" variant="primary" />
        <CopyButton text={octal} label="Copy octal" />
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => commit(0)}>
          Clear
        </Button>
      </ToolActions>

      <div className="mt-6">
        <p className="label-mono">Common permissions</p>
        <div className="mt-2 overflow-auto border-2 border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="label-mono">Octal</TableHead>
                <TableHead className="label-mono">Symbolic</TableHead>
                <TableHead className="label-mono">Typical use</TableHead>
                <TableHead className="label-mono"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[13px]">
              {COMMON.map((row) => {
                const value = parseInt(row.octal, 8);
                return (
                  <TableRow key={row.octal} className={value === bits ? "bg-muted hover:bg-muted" : undefined}>
                    <TableCell className="font-mono font-bold">{row.octal}</TableCell>
                    <TableCell className="font-mono">{toSymbolic(value)}</TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {row.use}
                      {"warn" in row && row.warn && (
                        <Chip className="ms-2 text-destructive">
                          <TriangleAlertIcon className="me-1 size-3" />
                          dangerous
                        </Chip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="xs" onClick={() => commit(value)}>
                        Use
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </ToolPanel>
  );
}
