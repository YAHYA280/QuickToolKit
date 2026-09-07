"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2Icon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorText } from "@/components/tools/ui";
import { submitContact, type ContactState } from "./actions";

interface ToolOption {
  slug: string;
  name: string;
}

export function ContactForm({ tools }: { tools: ToolOption[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [tool, setTool] = useState("none");
  const [renderedAt, setRenderedAt] = useState(0);

  useEffect(() => {
    // set after hydration so SSR HTML stays static
    const id = setTimeout(() => setRenderedAt(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="animate-pop brut border-success p-6 shadow-[4px_4px_0_0_var(--success)]"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="font-display text-base uppercase tracking-wide">Message received</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thanks for writing. We read every message and usually reply within one to three business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="brut p-5 sm:p-6" noValidate>
      <input type="hidden" name="_t" value={renderedAt} />
      {/* honeypot: hidden from humans, filled by bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name" className="mb-1.5">
            Name
          </Label>
          <Input id="c-name" name="name" required maxLength={80} autoComplete="name" aria-invalid={Boolean(state.errors?.name) || undefined} />
          <ErrorText>{state.errors?.name}</ErrorText>
        </div>
        <div>
          <Label htmlFor="c-email" className="mb-1.5">
            Email
          </Label>
          <Input id="c-email" name="email" type="email" required maxLength={120} autoComplete="email" aria-invalid={Boolean(state.errors?.email) || undefined} />
          <ErrorText>{state.errors?.email}</ErrorText>
        </div>
        <div>
          <Label htmlFor="c-subject" className="mb-1.5">
            Subject <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="c-subject" name="subject" maxLength={120} placeholder="Bug report, tool request, question" />
        </div>
        <div>
          <Label htmlFor="c-tool" className="mb-1.5">
            Related tool <span className="text-muted-foreground">(optional)</span>
          </Label>
          <input type="hidden" name="tool" value={tool === "none" ? "" : tool} />
          <Select value={tool} onValueChange={setTool}>
            <SelectTrigger id="c-tool" className="w-full">
              <SelectValue placeholder="Choose a tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not about a specific tool</SelectItem>
              {tools.map((t) => (
                <SelectItem key={t.slug} value={t.slug}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="c-message" className="mb-1.5">
            Message
          </Label>
          <Textarea
            id="c-message"
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            className="field-sizing-fixed"
            placeholder="What happened, what you expected, and the input that caused it if relevant."
            aria-invalid={Boolean(state.errors?.message) || undefined}
          />
          <ErrorText>{state.errors?.message}</ErrorText>
        </div>
      </div>

      {state.status === "error" && state.message && <ErrorText className="mt-4">{state.message}</ErrorText>}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Your message and email are stored so we can reply. Nothing else is collected.
        </p>
        <Button type="submit" disabled={pending} className="h-9 px-4">
          <SendIcon data-icon="inline-start" />
          {pending ? "Sending" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
