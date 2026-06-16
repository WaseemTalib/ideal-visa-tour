import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let cached: DrizzleDb | null = null;
let pool: Pool | null = null;

export function db(): DrizzleDb | null {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  pool = new Pool({
    connectionString: url,
    max: process.env.DATABASE_POOL_MAX ? Number(process.env.DATABASE_POOL_MAX) : 10,
    // Enable SSL automatically when the URL asks for it (Neon, Supabase, etc.).
    // Local Postgres connections (no sslmode=require) skip TLS.
    ssl: /sslmode=require/i.test(url) ? { rejectUnauthorized: false } : undefined,
  });
  cached = drizzle(pool, { schema });
  return cached;
}

export function requireDb(): DrizzleDb {
  const conn = db();
  if (!conn) throw new Error("DATABASE_URL is not set. Add it to .env.");
  return conn;
}

export { schema };
