import { config } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Monorepo root: packages/api/src/config → ../../../ */
const monorepoRoot = resolve(__dirname, "../../../..");

/**
 * Load env files in priority order (last wins):
 * 1. .env at monorepo root       — shared backend config (primary)
 * 2. packages/api/.env           — local API overrides (optional)
 */
export function loadDotenv(): void {
  const rootEnv = resolve(monorepoRoot, ".env");
  const apiEnv = resolve(monorepoRoot, "packages/api/.env");

  if (existsSync(rootEnv)) {
    config({ path: rootEnv });
  }

  if (existsSync(apiEnv)) {
    config({ path: apiEnv, override: true });
  }
}
