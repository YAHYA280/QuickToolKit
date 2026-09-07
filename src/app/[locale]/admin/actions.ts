"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/lib/admin-auth";
import { deleteMessage, markRead } from "@/lib/messages";

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  // small constant delay to blunt brute force
  await new Promise((r) => setTimeout(r, 400));
  if (!checkPassword(password)) return { error: "Wrong password." };
  await createSession();
  redirect("/admin/messages");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin");
}

async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/admin");
}

export async function markMessageRead(id: number, read: boolean): Promise<void> {
  await requireAuth();
  await markRead(id, read);
  revalidatePath("/admin/messages");
}

export async function removeMessage(id: number): Promise<void> {
  await requireAuth();
  await deleteMessage(id);
  revalidatePath("/admin/messages");
}
