"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Chip, CodeBlock, CopyButton, ErrorText, Label, TextArea, ToolActions, ToolPanel } from "@/components/tools/ui";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Json = Record<string, unknown>;

interface Decoded {
  header: Json;
  payload: Json;
  signature: string;
}

type Status = "valid" | "expired" | "not-yet-valid" | "no-expiry";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const CLAIMS: { key: string; label: string; time?: boolean }[] = [
  { key: "iss", label: "Issuer (iss)" },
  { key: "sub", label: "Subject (sub)" },
  { key: "aud", label: "Audience (aud)" },
  { key: "iat", label: "Issued at (iat)", time: true },
  { key: "nbf", label: "Not before (nbf)", time: true },
  { key: "exp", label: "Expires (exp)", time: true },
  { key: "jti", label: "JWT ID (jti)" },
];

const BADGE: Record<Status, { label: string; className: string }> = {
  valid: { label: "Valid", className: "border-success/40 text-success" },
  expired: { label: "Expired", className: "border-destructive/40 text-destructive" },
  "not-yet-valid": { label: "Not yet valid", className: "border-brand/40 text-brand-strong" },
  "no-expiry": { label: "No expiry claim", className: "text-muted-foreground" },
};

const CODE_BLOCK =
  "overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed";

function base64UrlDecode(segment: string): string {
  let s = segment.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error("not base64url");
  const rem = s.length % 4;
  if (rem === 1) throw new Error("bad length");
  if (rem) s += "=".repeat(4 - rem);
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isObject(v: unknown): v is Json {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function decodeSegment(segment: string, name: string): Json {
  let parsed: unknown;
  try {
    parsed = JSON.parse(base64UrlDecode(segment));
  } catch {
    throw new Error(`The ${name} is not valid base64url-encoded JSON.`);
  }
  if (!isObject(parsed)) throw new Error(`The ${name} must decode to a JSON object.`);
  return parsed;
}

function decodeJwt(raw: string): Decoded {
  const token = raw.trim().replace(/^Bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error(`A JWT has three dot-separated parts (header.payload.signature); found ${parts.length}.`);
  }
  const [h, p, s] = parts;
  if (!h || !p) throw new Error("Header and payload segments must not be empty.");
  return { header: decodeSegment(h, "header"), payload: decodeSegment(p, "payload"), signature: s };
}

function asSeconds(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function getStatus(payload: Json, now: number): Status {
  const exp = asSeconds(payload.exp);
  const nbf = asSeconds(payload.nbf);
  if (exp !== undefined && now >= exp * 1000) return "expired";
  if (nbf !== undefined && now < nbf * 1000) return "not-yet-valid";
  if (exp === undefined && nbf === undefined) return "no-expiry";
  return "valid";
}

function relative(ms: number): string {
  const units: [number, string][] = [
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
    [1, "s"],
  ];
  let rest = Math.round(Math.abs(ms) / 1000);
  const parts: string[] = [];
  for (const [size, label] of units) {
    if (rest >= size && parts.length < 2) {
      parts.push(`${Math.floor(rest / size)}${label}`);
      rest %= size;
    }
  }
  const text = parts.length ? parts.join(" ") : "0s";
  return ms >= 0 ? `in ${text}` : `${text} ago`;
}

function formatClaim(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function JsonBlock({ id, label, value }: { id: string; label: string; value: Json | null }) {
  const text = value ? JSON.stringify(value, null, 2) : "";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Label htmlFor={id} className="mb-0">
          {label}
        </Label>
        <CopyButton text={text} size="sm" variant="ghost" />
      </div>
      <CodeBlock id={id} code={text} minHeight={160} flashKey={text ? text.length : undefined} placeholder={`Decoded ${label.toLowerCase()} appears here`} />
    </div>
  );
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [now, setNow] = useState(0);

  const { decoded, error } = useMemo(() => {
    if (!token.trim()) return { decoded: null, error: "" };
    try {
      return { decoded: decodeJwt(token), error: "" };
    } catch (e) {
      return { decoded: null, error: e instanceof Error ? e.message : "Malformed token." };
    }
  }, [token]);

  useEffect(() => {
    if (!decoded) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [decoded]);

  const update = (value: string) => {
    setToken(value);
    setNow(Date.now());
  };

  const status = decoded ? getStatus(decoded.payload, now) : null;
  const claims = decoded ? CLAIMS.filter((c) => decoded.payload[c.key] !== undefined) : [];

  return (
    <ToolPanel>
      <Label htmlFor="jwt-in">Token</Label>
      <TextArea
        id="jwt-in"
        rows={5}
        value={token}
        onChange={(e) => update(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
        className="break-all"
        aria-invalid={Boolean(error) || undefined}
      />
      <ErrorText>{error}</ErrorText>

      <ToolActions>
        <Button onClick={() => update(SAMPLE)}>Load sample</Button>
        <span className="flex-1" />
        <Button variant="ghost" onClick={() => update("")} disabled={!token}>
          Clear
        </Button>
      </ToolActions>

      <p className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        This tool only decodes. The signature is <strong className="text-foreground">not verified</strong>, so a
        token that decodes cleanly may still be forged or tampered with. Decoding runs entirely in your browser and
        nothing is sent anywhere, but never paste production tokens into websites you do not trust.
      </p>

      {decoded && status && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={BADGE[status].className}>
            {BADGE[status].label}
          </Badge>
          {typeof decoded.header.alg === "string" && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Algorithm <Chip className="text-foreground">{decoded.header.alg}</Chip>
            </span>
          )}
          {typeof decoded.header.typ === "string" && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Type <Chip className="text-foreground">{decoded.header.typ}</Chip>
            </span>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <JsonBlock id="jwt-header" label="Header" value={decoded?.header ?? null} />
        <JsonBlock id="jwt-payload" label="Payload" value={decoded?.payload ?? null} />
      </div>

      {decoded && claims.length > 0 && (
        <div className="mt-6">
          <p className="label-mono">Registered claims</p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="label-mono">Claim</TableHead>
                  <TableHead className="label-mono">Value</TableHead>
                  <TableHead className="label-mono">Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-mono text-[13px] tabular-nums">
                {claims.map((c) => {
                  const raw = decoded.payload[c.key];
                  const secs = c.time ? asSeconds(raw) : undefined;
                  const date = secs !== undefined ? new Date(secs * 1000) : null;
                  return (
                    <TableRow key={c.key}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{c.label}</TableCell>
                      <TableCell className="break-all whitespace-normal text-brand-strong">{formatClaim(raw)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {date ? (
                          <>
                            {date.toLocaleString()}{" "}
                            <span className="text-[11px]">({relative(date.getTime() - now)})</span>
                          </>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {decoded && (
        <div className="mt-6">
          <p className="label-mono">Signature (base64url, not verified)</p>
          <code className={`mt-3 block ${CODE_BLOCK}`}>
            {decoded.signature || <span className="text-muted-foreground">empty (unsigned token)</span>}
          </code>
        </div>
      )}
    </ToolPanel>
  );
}
