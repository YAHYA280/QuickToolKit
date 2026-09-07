"use server";

import { headers } from "next/headers";
import { createMessage, isRateLimited } from "@/lib/messages";
import { tools } from "@/tools/registry";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success" };
  }
  // Bots submit instantly; humans take a few seconds.
  const rendered = Number(formData.get("_t") ?? 0);
  if (rendered && Date.now() - rendered < 2500) {
    return { status: "error", message: "That was quick. Please try again." };
  }

  const name = clean(formData.get("name"), 80);
  const email = clean(formData.get("email"), 120).toLowerCase();
  const subject = clean(formData.get("subject"), 120);
  const message = String(formData.get("message") ?? "").trim().slice(0, 4000);
  const toolRaw = clean(formData.get("tool"), 60);
  const tool = tools.some((t) => t.slug === toolRaw) ? toolRaw : undefined;

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Please write at least a few words.";
  if (Object.keys(errors).length) return { status: "error", errors };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "";
  const userAgent = h.get("user-agent") ?? "";
  const page = h.get("referer") ?? undefined;

  try {
    if (ip && (await isRateLimited(ip))) {
      return { status: "error", message: "Too many messages in a short time. Please try again later." };
    }
    await createMessage({ name, email, subject: subject || undefined, message, tool, page, ip, userAgent });
    return { status: "success" };
  } catch (err) {
    console.error("[contact] failed to store message", err);
    return { status: "error", message: "Something went wrong on our side. Please try again in a minute." };
  }
}
