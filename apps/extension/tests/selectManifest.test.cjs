const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCRIPT_PATH = path.resolve(__dirname, "../scripts/select-manifest.mjs");

function runSelectManifest(target, rootDir) {
  return spawnSync("node", [SCRIPT_PATH, target, "--root", rootDir], {
    encoding: "utf8",
  });
}

function createFixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "assignmint-manifest-test-"));
  const manifestsDir = path.join(root, "public", "manifests");
  const distDir = path.join(root, "dist");
  fs.mkdirSync(manifestsDir, { recursive: true });
  fs.mkdirSync(distDir, { recursive: true });

  fs.writeFileSync(
    path.join(manifestsDir, "manifest.chrome.json"),
    JSON.stringify({ browser: "chrome", manifest_version: 3 }, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(manifestsDir, "manifest.firefox.json"),
    JSON.stringify({ browser: "firefox", manifest_version: 3 }, null, 2),
    "utf8"
  );
  return root;
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test("selects chrome manifest", () => {
  const root = createFixtureRoot();
  const result = runSelectManifest("chrome", root);
  assert.equal(result.status, 0);

  const written = JSON.parse(
    fs.readFileSync(path.join(root, "dist", "manifest.json"), "utf8")
  );
  assert.equal(written.browser, "chrome");
});

test("selects firefox manifest", () => {
  const root = createFixtureRoot();
  const result = runSelectManifest("firefox", root);
  assert.equal(result.status, 0);

  const written = JSON.parse(
    fs.readFileSync(path.join(root, "dist", "manifest.json"), "utf8")
  );
  assert.equal(written.browser, "firefox");
});

test("fails on invalid target", () => {
  const root = createFixtureRoot();
  const result = runSelectManifest("safari", root);
  assert.notEqual(result.status, 0);
});
