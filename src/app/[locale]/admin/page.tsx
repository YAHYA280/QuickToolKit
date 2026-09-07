import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin/messages");
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <p className="label-mono">Admin</p>
      <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
