import { readFileSync } from "fs";
import path from "path";
import { Pool } from "pg";
import { scrubSecrets } from "@/lib/format";

type GlobalDb = {
  pool?: Pool;
  schema?: Promise<void> | null;
};

const globalDb = globalThis as typeof globalThis & { __tefDb?: GlobalDb };

function state(): GlobalDb {
  if (!globalDb.__tefDb) globalDb.__tefDb = {};
  return globalDb.__tefDb;
}

export function databaseUrl(): string | null {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || null;
}

export function migrationUrl(): string | null {
  return (
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    null
  );
}

function attachPool(pool: Pool) {
  void import("@vercel/functions")
    .then((mod) => {
      if (typeof mod.attachDatabasePool === "function") mod.attachDatabasePool(pool);
    })
    .catch(() => {
      // Local Node does not need the Vercel pool helper.
    });
}

export function getPool(): Pool {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL or POSTGRES_URL is not set");
  const current = state();
  if (!current.pool) {
    current.pool = new Pool({ connectionString: url, max: 5 });
    attachPool(current.pool);
  }
  return current.pool;
}

export function schemaSql(): string {
  return readFileSync(path.join(process.cwd(), "db/migrations/001_init.sql"), "utf8");
}

export async function migrate(connectionString = migrationUrl()): Promise<void> {
  if (!connectionString) throw new Error("DATABASE_URL or POSTGRES_URL is not set");
  const pool = new Pool({ connectionString, max: 1 });
  try {
    await pool.query(schemaSql());
  } finally {
    await pool.end();
  }
}

export async function ensureSchema(): Promise<void> {
  const current = state();
  if (!current.schema) {
    current.schema = getPool()
      .query(schemaSql())
      .then(() => undefined)
      .catch((error: unknown) => {
        current.schema = null;
        throw error;
      });
  }
  await current.schema;
}

export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

export async function migrateIfConfigured(): Promise<void> {
  if (!databaseUrl()) return;
  try {
    await ensureSchema();
  } catch (error) {
    console.error(scrubSecrets(error instanceof Error ? error.message : String(error)));
  }
}

export async function logError(error: unknown, path?: string | null): Promise<void> {
  if (!databaseUrl()) return;
  const message = scrubSecrets(error instanceof Error ? error.message : String(error)).slice(0, 2000);
  const stack = error instanceof Error && error.stack ? scrubSecrets(error.stack).slice(0, 4000) : null;
  try {
    await query("INSERT INTO errors (message, path, stack) VALUES ($1, $2, $3)", [
      message,
      path ? path.slice(0, 200) : null,
      stack,
    ]);
  } catch (logFailure) {
    console.error(scrubSecrets(logFailure instanceof Error ? logFailure.message : String(logFailure)));
  }
}
