import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const target = argv[0];
  let root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--root") {
      const value = argv[i + 1];
      if (!value) {
        throw new Error("Missing value for --root");
      }
      root = path.resolve(value);
      i += 1;
    }
  }

  return { target, root };
}

async function main() {
  const { target, root } = parseArgs(process.argv.slice(2));
  if (!target || !["chrome", "firefox"].includes(target)) {
    throw new Error("Usage: node scripts/select-manifest.mjs <chrome|firefox> [--root <dir>]");
  }

  const sourcePath = path.join(root, "public", "manifests", `manifest.${target}.json`);
  const distDir = path.join(root, "dist");
  const destinationPath = path.join(distDir, "manifest.json");

  const manifestRaw = await fs.readFile(sourcePath, "utf8");
  // Validate JSON before writing
  JSON.parse(manifestRaw);

  await fs.mkdir(distDir, { recursive: true });
  await fs.writeFile(destinationPath, manifestRaw, "utf8");

  console.log(`Selected ${target} manifest -> ${destinationPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
