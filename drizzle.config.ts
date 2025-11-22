import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;

if (!url) {
  console.warn(
    "DATABASE_URL not set — Drizzle will not run against Postgres in this environment.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
