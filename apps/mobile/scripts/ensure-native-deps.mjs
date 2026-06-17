import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, "..");
const mobileNodeModules = path.join(mobileRoot, "node_modules");
const monorepoNodeModules = path.resolve(mobileRoot, "../../node_modules");

const pkgJson = JSON.parse(
  fs.readFileSync(path.join(mobileRoot, "package.json"), "utf8"),
);

/** Symlink every hoisted dependency into apps/mobile/node_modules for Metro. */
const deps = [
  ...Object.keys(pkgJson.dependencies ?? {}),
  ...Object.keys(pkgJson.devDependencies ?? {}),
].filter((name) => !name.startsWith("@driven-rewards/"));

fs.mkdirSync(mobileNodeModules, { recursive: true });

let linked = 0;
const missing = [];

for (const name of deps) {
  const source = path.join(monorepoNodeModules, name);
  const target = path.join(mobileNodeModules, name);

  if (!fs.existsSync(source)) {
    missing.push(name);
    continue;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });

  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }

  fs.symlinkSync(source, target, "dir");
  linked++;
}

console.log(`[ensure-mobile-deps] linked ${linked} packages`);
if (missing.length > 0) {
  console.warn(`[ensure-mobile-deps] missing (run pnpm install): ${missing.join(", ")}`);
}
