import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import bcrypt from "bcryptjs";

const root = process.cwd();

function parseEnv(content) {
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    env[key] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}

async function loadEnv() {
  const env = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    try {
      Object.assign(env, parseEnv(await fs.readFile(path.join(root, file), "utf8")));
    } catch {
      // optional
    }
  }
  return env;
}

function usage() {
  console.log("Usage:");
  console.log("  npm run create-admin -- <email> <password> [full-name]");
  console.log("  npm run create-admin                (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env)");
}

async function main() {
  const env = await loadEnv();
  if (!env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in .env.");
    process.exit(1);
  }

  const [argEmail, argPassword, ...nameParts] = process.argv.slice(2);
  const email = String(argEmail ?? env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = String(argPassword ?? env.ADMIN_PASSWORD ?? "");
  const fullName = nameParts.length ? nameParts.join(" ") : email.split("@")[0];

  if (!email || !password) {
    usage();
    process.exit(1);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Invalid email address.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    ssl: /sslmode=require/i.test(env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await pool.query(`SELECT id FROM profiles WHERE email = $1 LIMIT 1`, [email]);
    if (existing.rows.length) {
      await pool.query(
        `UPDATE profiles
           SET password_hash = $1,
               full_name = $2,
               role = 'admin',
               updated_at = NOW()
           WHERE email = $3`,
        [passwordHash, fullName, email],
      );
      console.log(`Updated admin: ${email}`);
    } else {
      await pool.query(
        `INSERT INTO profiles (id, email, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4, 'admin')`,
        [randomUUID(), email, passwordHash, fullName],
      );
      console.log(`Created admin: ${email}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
