# Firefox + Chrome Dual-Target Compatibility Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a single extension codebase that builds and runs for both Chrome and Firefox with target-specific manifests and minimal runtime branching.

**Architecture:** Keep all React/content-script/background source shared. Introduce dual manifest artifacts (`chrome` and `firefox`) and a small post-build manifest selection step. Use runtime feature detection in background/content code for APIs that differ (notably popup opening), and keep `chrome` namespace usage with compatibility fallback where needed.

**Tech Stack:** Vite, React + TypeScript, MV3 manifest, WebExtensions APIs (`action`, `tabs`, `alarms`, `storage`), Firefox `browser_specific_settings`

---

### Task 1: Add target manifests and choose build strategy

**Files:**
- Create: `apps/extension/public/manifests/manifest.chrome.json`
- Create: `apps/extension/public/manifests/manifest.firefox.json`
- Modify: `apps/extension/public/manifest.json`
- Create: `apps/extension/scripts/select-manifest.mjs`
- Modify: `apps/extension/package.json`

**Step 1: Copy current manifest into target manifests**

Chrome manifest keeps:
```json
"background": { "service_worker": "background.js" }
```

Firefox manifest uses:
```json
"background": { "scripts": ["background.js"] },
"browser_specific_settings": {
  "gecko": {
    "id": "assignmint@assignmint.ai",
    "strict_min_version": "121.0"
  }
}
```

**Step 2: Keep `public/manifest.json` as Chrome dev default**
- `vite dev` remains unchanged.

**Step 3: Add `select-manifest.mjs`**
- Script copies `public/manifests/manifest.<target>.json` to `dist/manifest.json`.
- Validate `target` arg is `chrome` or `firefox`.

**Step 4: Add package scripts**
```json
"build:base": "vite build",
"build:chrome": "npm run build:base && node scripts/select-manifest.mjs chrome",
"build:firefox": "npm run build:base && node scripts/select-manifest.mjs firefox"
```

### Task 2: Make popup-opening flow work cross-browser

**Files:**
- Modify: `apps/extension/public/background.js`
- Modify: `apps/extension/public/content.js`

**Step 1: Keep existing message contract from content script**
- Continue sending `{ action: "openPopup" }`.

**Step 2: Add Firefox-safe fallback in background**
- Current code depends on:
```js
chrome.action.openPopup()
```
- Replace with logic:
1. Try `chrome.action.openPopup()` when available and allowed.
2. Fallback to:
```js
const url = chrome.runtime.getURL("index.html");
chrome.tabs.create({ url });
```

This keeps behavior consistent on Firefox where `openPopup` may fail outside user-gesture constraints.

### Task 3: Add thin runtime API normalization utility (optional but recommended)

**Files:**
- Create: `apps/extension/src/lib/webext.ts`
- Modify: `apps/extension/src/lib/storage.ts`
- Modify: `apps/extension/src/main.tsx`
- Modify: any direct `chrome.*` call sites where Promise behavior matters

**Step 1: Create helper**
```ts
export const webext = globalThis.browser ?? globalThis.chrome;
```

**Step 2: Use helper where callbacks/promises differ**
- Keep changes minimal; avoid broad rewrite.

### Task 4: Add sanity tests for manifest selection script (TDD)

**Files:**
- Create: `apps/extension/tests/selectManifest.test.cjs`
- Test target: `apps/extension/scripts/select-manifest.mjs`

**Step 1: Write failing tests first**
- Fails on invalid target.
- Writes expected manifest for `chrome`.
- Writes expected manifest for `firefox`.

**Step 2: Run and verify RED**
```bash
node apps/extension/tests/selectManifest.test.cjs
```

**Step 3: Implement minimal script and verify GREEN**
```bash
node apps/extension/tests/selectManifest.test.cjs
```

### Task 5: Build and verify both targets

**Files:**
- Modify: `apps/extension/README.md` (or top-level README extension section)

**Step 1: Typecheck shared code**
```bash
pnpm --filter extension exec tsc --noEmit
```

**Step 2: Build Chrome**
```bash
pnpm --filter extension build:chrome
```
Expected: `apps/extension/dist/manifest.json` contains `background.service_worker`.

**Step 3: Build Firefox**
```bash
pnpm --filter extension build:firefox
```
Expected: `apps/extension/dist/manifest.json` contains `background.scripts` and `browser_specific_settings.gecko`.

**Step 4: Manual smoke checks**
1. Chrome: load unpacked extension from `dist`, open popup, run assignment flow.
2. Firefox: load temporary add-on from `dist/manifest.json`, popup opens from toolbar click, content-script button opens extension UI (popup or new tab fallback), analysis polling and badges work.

### Task 6: Document browser support matrix

**Files:**
- Modify: `README.md`

**Step 1: Add section**
- Supported targets: Chrome, Firefox.
- Build commands per target.
- Known behavioral difference: programmatic popup opening may fallback to extension tab in Firefox.

---

## External Compatibility Notes (from MDN, Feb 28, 2026)
- Firefox does not support MV3 `background.service_worker`; use `background.scripts` for Firefox target.
- `action.openPopup()` in stable Firefox has user-action constraints.
- Firefox sidebars use `sidebarAction` (not Chrome `sidePanel`).
