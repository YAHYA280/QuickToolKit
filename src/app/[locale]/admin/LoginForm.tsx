"use client";

import { useActionState } from "react";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorText } from "@/components/tools/ui";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="brut p-6">
      <Label htmlFor="admin-password" className="mb-1.5">
        Password
      </Label>
      <Input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus />
      <ErrorText>{state.error}</ErrorText>
      <Button type="submit" disabled={pending} className="mt-4 w-full">
        <LockIcon data-icon="inline-start" />
        {pending ? "Checking" : "Sign in"}
      </Button>
    </form>
  );
}
