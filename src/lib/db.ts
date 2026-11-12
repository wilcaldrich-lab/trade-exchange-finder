import { readdirSync, readFileSync } from "fs";
import path from "path";
import { Pool, type PoolConfig } from "pg";
import { scrubSecrets } from "@/lib/format";

type GlobalDb = {
  pool?: Pool;
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

/** Drop sslmode from the URL and require a verified certificate when TLS is requested. */
export function poolConfig(connectionString: string, max: number): PoolConfig {
  try {
    const parsed = new URL(connectionString);
    const mode = (parsed.searchParams.get("sslmode") || "").toLowerCase();
    if (mode && mode !== "disable") {
      parsed.searchParams.delete("sslmode");
      return { connectionString: parsed.toString(), max, ssl: { rejectUnauthorized: true } };
    }
  } catch {
    // Keep strings pg accepts that the URL parser does not.
  }
  return { connectionString, max };
}

export function getPool(): Pool {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL or POSTGRES_URL is not set");
  const current = state();
  if (!current.pool) {
    current.pool = new Pool(poolConfig(url, 5));
    attachPool(current.pool);
  }
  return current.pool;
}

export function migrationFiles(): string[] {
  const dir = path.join(process.cwd(), "db/migrations");
  return readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort();
}

export async function migrate(connectionString = migrationUrl()): Promise<void> {
  if (!connectionString) throw new Error("DATABASE_URL or POSTGRES_URL is not set");
  const pool = new Pool(poolConfig(connectionString, 1));
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
    for (const file of migrationFiles()) {
      const id = file.replace(/\.sql$/, "");
      const existing = await pool.query("SELECT 1 FROM schema_migrations WHERE id = $1", [id]);
      if (existing.rowCount) continue;
      const sql = readFileSync(path.join(process.cwd(), "db/migrations", file), "utf8");
      await pool.query(sql);
      await pool.query("INSERT INTO schema_migrations (id) VALUES ($1) ON CONFLICT (id) DO NOTHING", [id]);
    }
  } finally {
    await pool.end();
  }
}

export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

export async function migrateIfConfigured(): Promise<void> {
  if (!migrationUrl()) return;
  try {
    await migrate();
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
