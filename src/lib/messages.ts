import "server-only";
import { createHash } from "node:crypto";
import { db, ensureSchema } from "./db";

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  tool: string | null;
  page: string | null;
  created_at: Date;
  read_at: Date | null;
}

export interface NewMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
  tool?: string;
  page?: string;
  ip?: string;
  userAgent?: string;
}

const RATE_LIMIT_WINDOW_MIN = 15;
const RATE_LIMIT_MAX = 3;

export function hashIp(ip: string): string {
  const salt = process.env.ADMIN_SECRET ?? "tabutils";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function isRateLimited(ip: string): Promise<boolean> {
  await ensureSchema();
  const sql = db();
  const [row] = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM messages
    WHERE ip_hash = ${hashIp(ip)} AND created_at > now() - (${RATE_LIMIT_WINDOW_MIN} || ' minutes')::interval`;
  return (row?.n ?? 0) >= RATE_LIMIT_MAX;
}

export async function createMessage(input: NewMessage): Promise<number> {
  await ensureSchema();
  const sql = db();
  const [row] = await sql<{ id: number }[]>`
    INSERT INTO messages (name, email, subject, message, tool, page, ip_hash, user_agent)
    VALUES (${input.name}, ${input.email}, ${input.subject ?? null}, ${input.message},
            ${input.tool ?? null}, ${input.page ?? null},
            ${input.ip ? hashIp(input.ip) : null}, ${input.userAgent?.slice(0, 300) ?? null})
    RETURNING id`;
  return row.id;
}

export async function listMessages(opts: { unreadOnly?: boolean; limit?: number } = {}): Promise<Message[]> {
  await ensureSchema();
  const sql = db();
  const limit = Math.min(opts.limit ?? 100, 500);
  return sql<Message[]>`
    SELECT id, name, email, subject, message, tool, page, created_at, read_at
    FROM messages
    ${opts.unreadOnly ? sql`WHERE read_at IS NULL` : sql``}
    ORDER BY created_at DESC
    LIMIT ${limit}`;
}

export async function countUnread(): Promise<number> {
  await ensureSchema();
  const [row] = await db()<{ n: number }[]>`SELECT count(*)::int AS n FROM messages WHERE read_at IS NULL`;
  return row?.n ?? 0;
}

export async function markRead(id: number, read = true): Promise<void> {
  await ensureSchema();
  await db()`UPDATE messages SET read_at = ${read ? new Date() : null} WHERE id = ${id}`;
}

export async function deleteMessage(id: number): Promise<void> {
  await ensureSchema();
  await db()`DELETE FROM messages WHERE id = ${id}`;
}
