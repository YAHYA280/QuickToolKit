import "server-only";
import postgres, { type Sql } from "postgres";

declare global {
  var __tabutilsSql: Sql | undefined;
  var __tabutilsSchemaReady: Promise<void> | undefined;
}

function connect(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return postgres(url, {
    ssl: url.includes("sslmode=require") ? "require" : false,
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

/** Shared connection pool (reused across hot reloads and serverless invocations). */
export function db(): Sql {
  if (!globalThis.__tabutilsSql) globalThis.__tabutilsSql = connect();
  return globalThis.__tabutilsSql;
}

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  tool TEXT,
  page TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS messages_created_idx ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_ip_created_idx ON messages (ip_hash, created_at);
`;

/** Creates tables if missing. Runs once per process. */
export function ensureSchema(): Promise<void> {
  if (!globalThis.__tabutilsSchemaReady) {
    globalThis.__tabutilsSchemaReady = db()
      .unsafe(SCHEMA_SQL)
      .then(() => undefined)
      .catch((err) => {
        globalThis.__tabutilsSchemaReady = undefined;
        throw err;
      });
  }
  return globalThis.__tabutilsSchemaReady;
}
