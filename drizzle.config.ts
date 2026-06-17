import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't auto-load .env files. Load .env.local first (Next.js
// convention) and fall back to .env so the connection string is available
// when running `npm run db:migrate` / `db:push` / `db:studio`.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  casing: "snake_case",
  strict: true,
  verbose: true,
});
