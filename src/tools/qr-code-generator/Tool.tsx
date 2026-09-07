"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { DownloadIcon } from "lucide-react";
import {
  Button,
  CheckboxField,
  Chip,
  CodeBlock,
  CopyButton,
  ErrorText,
  Hint,
  Label,
  Segmented,
  SelectField,
  SliderField,
  TextArea,
  TextInput,
  ToolActions,
  ToolPanel,
} from "@/components/tools/ui";

type Mode = "url" | "text" | "wifi" | "vcard" | "email";
type Ecl = "L" | "M" | "Q" | "H";
type WifiAuth = "WPA" | "WEP" | "nopass";

const MODES: { value: Mode; label: string }[] = [
  { value: "url", label: "URL" },
  { value: "text", label: "Text" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "vcard", label: "Contact" },
  { value: "email", label: "Email" },
];

const ECL_OPTIONS = [
  { value: "L", label: "L, low (7% recovery)" },
  { value: "M", label: "M, medium (15% recovery)" },
  { value: "Q", label: "Q, quartile (25% recovery)" },
  { value: "H", label: "H, high (30% recovery)" },
];

const WIFI_AUTH_OPTIONS = [
  { value: "WPA", label: "WPA / WPA2 / WPA3" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "None (open network)" },
];

const DEFAULT_URL = "https://tabutils.com";
const WARN_LENGTH = 1000;

/** Escape the characters that are special inside WIFI: payloads. */
const escapeWifi = (s: string) => s.replace(/([\\;,":])/g, "\\$1");
/** Escape separators and newlines in vCard property values. */
const escapeVcard = (s: string) => s.replace(/([\\;,])/g, "\\$1").replace(/\r?\n/g, "\\n");

function buildWifi(ssid: string, password: string, auth: WifiAuth, hidden: boolean): string {
  if (!ssid) return "";
  let out = `WIFI:T:${auth};S:${escapeWifi(ssid)};`;
  if (auth !== "nopass" && password) out += `P:${escapeWifi(password)};`;
  if (hidden) out += "H:true;";
  return `${out};`;
}

interface Contact {
  name: string;
  phone: string;
  email: string;
  org: string;
  url: string;
}

function buildVcard(c: Contact): string {
  const name = c.name.trim();
  const org = c.org.trim();
  const phone = c.phone.trim();
  const email = c.email.trim();
  const url = c.url.trim();
  if (!name && !phone && !email && !org && !url) return "";
  const parts = name.split(/\s+/).filter(Boolean);
  const given = parts[0] ?? "";
  const family = parts.slice(1).join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVcard(family)};${escapeVcard(given)};;;`,
    `FN:${escapeVcard(name || org || email)}`,
  ];
  if (org) lines.push(`ORG:${escapeVcard(org)}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${escapeVcard(phone)}`);
  if (email) lines.push(`EMAIL:${escapeVcard(email)}`);
  if (url) lines.push(`URL:${escapeVcard(url)}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function buildMailto(to: string, subject: string, body: string): string {
  if (!to.trim() && !subject.trim() && !body.trim()) return "";
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to.trim()}${params.length ? `?${params.join("&")}` : ""}`;
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const COLOR_INPUT = "size-9 cursor-pointer border-2 border-border bg-card p-1";

export default function QrCodeGeneratorTool() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState(DEFAULT_URL);
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", password: "", auth: "WPA" as WifiAuth, hidden: false });
  const [contact, setContact] = useState<Contact>({ name: "", phone: "", email: "", org: "", url: "" });
  const [mail, setMail] = useState({ to: "", subject: "", body: "" });

  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(4);
  const [ecl, setEcl] = useState<Ecl>("M");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const [renderError, setRenderError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const payload = useMemo(() => {
    switch (mode) {
      case "url":
        return url.trim();
      case "text":
        return text;
      case "wifi":
        return buildWifi(wifi.ssid, wifi.password, wifi.auth, wifi.hidden);
      case "vcard":
        return buildVcard(contact);
      case "email":
        return buildMailto(mail.to, mail.subject, mail.body);
    }
  }, [mode, url, text, wifi, contact, mail]);

  const bytes = useMemo(() => new TextEncoder().encode(payload).length, [payload]);

  const symbol = useMemo(() => {
    if (!payload) return null;
    try {
      const qr = QRCode.create(payload, { errorCorrectionLevel: ecl });
      return { version: qr.version, modules: qr.modules.size };
    } catch {
      return null;
    }
  }, [payload, ecl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!payload) {
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d")?.clearRect(0, 0, size, size);
      return;
    }
    let cancelled = false;
    QRCode.toCanvas(canvas, payload, {
      width: size,
      margin,
      errorCorrectionLevel: ecl,
      color: { dark: fg, light: bg },
    })
      .then(() => {
        if (!cancelled) setRenderError("");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        setRenderError(e instanceof Error ? e.message : "Could not render the QR code.");
      });
    return () => {
      cancelled = true;
    };
  }, [payload, size, margin, ecl, fg, bg]);

  const error = payload ? renderError : "";
  const ready = Boolean(payload) && !error;

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    triggerDownload(canvas.toDataURL("image/png"), `qr-code-${size}px.png`);
  };

  const downloadSvg = async () => {
    if (!ready) return;
    try {
      const svg = await QRCode.toString(payload, {
        type: "svg",
        width: size,
        margin,
        errorCorrectionLevel: ecl,
        color: { dark: fg, light: bg },
      });
      const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      triggerDownload(blobUrl, "qr-code.svg");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (e) {
      setRenderError(e instanceof Error ? e.message : "Could not build the SVG.");
    }
  };

  const reset = () => {
    setUrl(mode === "url" ? DEFAULT_URL : "");
    setText("");
    setWifi({ ssid: "", password: "", auth: "WPA", hidden: false });
    setContact({ name: "", phone: "", email: "", org: "", url: "" });
    setMail({ to: "", subject: "", body: "" });
  };

  return (
    <ToolPanel>
      <div className="grid gap-6 md:grid-cols-2 [&>*]:min-w-0">
        <div>
          <Label className="mb-2">Content</Label>
          <Segmented aria-label="Content type" className="flex-wrap" value={mode} onChange={setMode} options={MODES} />

          <div className="mt-4 grid gap-3">
            {mode === "url" && (
              <div>
                <Label htmlFor="qr-url">Website URL</Label>
                <TextInput
                  id="qr-url"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                />
              </div>
            )}

            {mode === "text" && (
              <div>
                <Label htmlFor="qr-text">Text</Label>
                <TextArea
                  id="qr-text"
                  rows={5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Any text: a message, a serial number, a ticket ID"
                />
              </div>
            )}

            {mode === "wifi" && (
              <>
                <div>
                  <Label htmlFor="qr-ssid">Network name (SSID)</Label>
                  <TextInput
                    id="qr-ssid"
                    mono={false}
                    autoComplete="off"
                    value={wifi.ssid}
                    onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                    placeholder="MyHomeWiFi"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="qr-wifi-pass">Password</Label>
                    <TextInput
                      id="qr-wifi-pass"
                      autoComplete="off"
                      value={wifi.password}
                      onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                      placeholder="secret"
                      disabled={wifi.auth === "nopass"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="qr-wifi-auth">Encryption</Label>
                    <SelectField
                      id="qr-wifi-auth"
                      value={wifi.auth}
                      onChange={(v) => setWifi({ ...wifi, auth: v as WifiAuth })}
                      options={WIFI_AUTH_OPTIONS}
                    />
                  </div>
                </div>
                <CheckboxField
                  id="qr-wifi-hidden"
                  checked={wifi.hidden}
                  onChange={(v) => setWifi({ ...wifi, hidden: v })}
                  label="Hidden network (SSID not broadcast)"
                />
              </>
            )}

            {mode === "vcard" && (
              <>
                <div>
                  <Label htmlFor="qr-name">Full name</Label>
                  <TextInput
                    id="qr-name"
                    mono={false}
                    autoComplete="off"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="qr-phone">Phone</Label>
                    <TextInput
                      id="qr-phone"
                      type="tel"
                      autoComplete="off"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="+1 555 0100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qr-email">Email</Label>
                    <TextInput
                      id="qr-email"
                      type="email"
                      autoComplete="off"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="ada@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qr-org">Organization</Label>
                    <TextInput
                      id="qr-org"
                      mono={false}
                      autoComplete="off"
                      value={contact.org}
                      onChange={(e) => setContact({ ...contact, org: e.target.value })}
                      placeholder="Analytical Engines Ltd"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qr-contact-url">Website</Label>
                    <TextInput
                      id="qr-contact-url"
                      type="url"
                      autoComplete="off"
                      value={contact.url}
                      onChange={(e) => setContact({ ...contact, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === "email" && (
              <>
                <div>
                  <Label htmlFor="qr-mail-to">To</Label>
                  <TextInput
                    id="qr-mail-to"
                    type="email"
                    autoComplete="off"
                    value={mail.to}
                    onChange={(e) => setMail({ ...mail, to: e.target.value })}
                    placeholder="support@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="qr-mail-subject">Subject</Label>
                  <TextInput
                    id="qr-mail-subject"
                    mono={false}
                    autoComplete="off"
                    value={mail.subject}
                    onChange={(e) => setMail({ ...mail, subject: e.target.value })}
                    placeholder="Order #1234"
                  />
                </div>
                <div>
                  <Label htmlFor="qr-mail-body">Body</Label>
                  <TextArea
                    id="qr-mail-body"
                    rows={3}
                    value={mail.body}
                    onChange={(e) => setMail({ ...mail, body: e.target.value })}
                    placeholder="Hello, I have a question about"
                  />
                </div>
              </>
            )}
          </div>

          <p className="label-mono mt-6">Options</p>
          <div className="mt-3 grid gap-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="qr-size" className="mb-0">
                  Size
                </Label>
                <Chip>{size} px</Chip>
              </div>
              <SliderField id="qr-size" value={size} onChange={setSize} min={128} max={1024} step={16} aria-label="Image size in pixels" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="qr-margin" className="mb-0">
                  Margin (quiet zone)
                </Label>
                <Chip>{margin} modules</Chip>
              </div>
              <SliderField id="qr-margin" value={margin} onChange={setMargin} min={0} max={8} step={1} aria-label="Quiet zone in modules" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] [&>*]:min-w-0">
              <div>
                <Label htmlFor="qr-ecl">Error correction</Label>
                <SelectField id="qr-ecl" value={ecl} onChange={(v) => setEcl(v as Ecl)} options={ECL_OPTIONS} />
              </div>
              <div>
                <Label>Colors</Label>
                <div className="flex h-9 items-center gap-3">
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="color"
                      aria-label="Foreground color"
                      value={fg}
                      onChange={(e) => setFg(e.target.value)}
                      className={COLOR_INPUT}
                    />
                    <span className="text-muted-foreground">Front</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="color"
                      aria-label="Background color"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      className={COLOR_INPUT}
                    />
                    <span className="text-muted-foreground">Back</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label className="mb-0">Preview</Label>
            {symbol && (
              <Hint className="mt-0">
                version {symbol.version} · {symbol.modules}×{symbol.modules} modules
              </Hint>
            )}
          </div>
          <div className="flex items-center justify-center border-2 border-border bg-muted p-4">
            <div className="w-full" style={{ maxWidth: size }}>
              <canvas
                ref={canvasRef}
                width={size}
                height={size}
                role="img"
                aria-label={payload ? `QR code for ${payload.slice(0, 80)}` : "Empty QR code preview"}
                className="block h-auto! w-full! bg-card"
              />
            </div>
          </div>
          {!payload && <Hint>Fill in the fields on the left to generate a code.</Hint>}
          <ErrorText>{error}</ErrorText>

          <ToolActions>
            <Button variant="primary" onClick={downloadPng} disabled={!ready}>
              <DownloadIcon data-icon="inline-start" />
              Download PNG
            </Button>
            <Button onClick={downloadSvg} disabled={!ready}>
              <DownloadIcon data-icon="inline-start" />
              Download SVG
            </Button>
            <CopyButton text={payload} label="Copy payload" />
            <span className="flex-1" />
            <Button variant="ghost" onClick={reset}>
              Clear
            </Button>
          </ToolActions>

          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="qr-payload" className="mb-0">
                Encoded payload
              </Label>
              <Hint className={payload.length > WARN_LENGTH ? "mt-0 text-destructive" : "mt-0"}>
                {payload.length.toLocaleString()} chars · {bytes.toLocaleString()} bytes
              </Hint>
            </div>
            <CodeBlock
              id="qr-payload"
              code={payload}
              language="text"
              lineNumbers={false}
              minHeight={96}
              maxHeight="30vh"
              placeholder="The exact text a scanner will read appears here."
            />
            {payload.length > WARN_LENGTH && (
              <Hint className="text-destructive">
                Payloads over {WARN_LENGTH.toLocaleString()} characters produce very dense codes that many phone cameras cannot
                read. Shorten the content or use a short URL.
              </Hint>
            )}
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}
