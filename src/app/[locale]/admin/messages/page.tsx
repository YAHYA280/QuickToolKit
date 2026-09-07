import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckIcon, InboxIcon, LogOutIcon, MailIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/admin-auth";
import { countUnread, listMessages } from "@/lib/messages";
import { getTool } from "@/tools/registry";
import { cn } from "@/lib/utils";
import { logout, markMessageRead, removeMessage } from "../actions";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

function fmt(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(d) + " UTC";
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { filter } = await searchParams;
  const unreadOnly = filter === "unread";

  let messages: Awaited<ReturnType<typeof listMessages>> = [];
  let unread = 0;
  let dbError: string | null = null;
  try {
    [messages, unread] = await Promise.all([listMessages({ unreadOnly }), countUnread()]);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono">Admin</p>
          <h1 className="mt-2 flex items-center gap-3 text-3xl">
            <InboxIcon className="size-6 text-brand" /> Messages
            {unread > 0 && (
              <Badge className="bg-highlight text-highlight-foreground">{unread} unread</Badge>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/messages"
            className={cn("border-2 border-foreground px-2.5 py-1 font-mono text-[11px] font-bold uppercase", !unreadOnly ? "bg-foreground text-background" : "bg-card hover:bg-highlight")}
          >
            All
          </Link>
          <Link
            href="/admin/messages?filter=unread"
            className={cn("border-2 border-foreground px-2.5 py-1 font-mono text-[11px] font-bold uppercase", unreadOnly ? "bg-foreground text-background" : "bg-card hover:bg-highlight")}
          >
            Unread
          </Link>
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOutIcon data-icon="inline-start" /> Sign out
            </Button>
          </form>
        </div>
      </div>

      {dbError && (
        <p role="alert" className="mt-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 font-mono text-sm text-destructive">
          {dbError}
        </p>
      )}

      {!dbError && messages.length === 0 && (
        <p className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          {unreadOnly ? "No unread messages." : "No messages yet."}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {messages.map((m) => {
          const tool = m.tool ? getTool(m.tool) : undefined;
          const isUnread = !m.read_at;
          const replyHref = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? "your message to TabUtils"}`)}`;
          return (
            <li
              key={m.id}
              className={cn(
                "border-2 bg-card p-5 transition-colors",
                isUnread ? "border-primary shadow-hard-blue" : "border-foreground",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="font-mono text-xs text-muted-foreground hover:text-foreground">
                      {m.email}
                    </a>
                    {isUnread && <Badge className="bg-highlight text-highlight-foreground">New</Badge>}
                    {tool && (
                      <Link href={`/tools/${tool.slug}`} className="font-mono text-[11px] text-muted-foreground hover:text-foreground">
                        #{tool.slug}
                      </Link>
                    )}
                  </div>
                  <p className="mt-1 font-medium">{m.subject ?? <span className="text-muted-foreground">(no subject)</span>}</p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{fmt(m.created_at)}</span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{m.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={replyHref}>
                    <MailIcon data-icon="inline-start" /> Reply
                  </a>
                </Button>
                <form action={markMessageRead.bind(null, m.id, isUnread)}>
                  <Button size="sm" variant="ghost" type="submit">
                    {isUnread ? <CheckIcon data-icon="inline-start" /> : <RotateCcwIcon data-icon="inline-start" />}
                    {isUnread ? "Mark read" : "Mark unread"}
                  </Button>
                </form>
                <span className="flex-1" />
                <form action={removeMessage.bind(null, m.id)}>
                  <Button size="sm" variant="destructive" type="submit">
                    <Trash2Icon data-icon="inline-start" /> Delete
                  </Button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
