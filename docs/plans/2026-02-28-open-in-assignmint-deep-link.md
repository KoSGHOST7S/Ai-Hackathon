# Open-in-Assignmint Deep Link Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the "Open in Assignmint" button navigate the popup directly to the assignment detail page.

**Architecture:** The content script already stores `{ courseId, assignmentId }` in `chrome.storage.local` when the button is clicked, but App.tsx never reads it. We fix content.js to store a JSON string (compatible with `storageGet`), then add a `pendingTarget` state to App.tsx that reads and clears this value on mount. Once assignments load, App.tsx finds and selects the matching assignment.

**Tech Stack:** Chrome Extension MV3, React + TypeScript, `chrome.storage.local` via `storageGet`/`storageRemove` from `apps/extension/src/lib/storage.ts`

---

### Task 1: Update content.js to store pendingAssignment as JSON string

**Files:**
- Modify: `apps/extension/public/content.js:56-59`

**Context:**

Currently the click handler does:
```js
chrome.storage.local.set({ pendingAnalyze: { courseId, assignmentId } });
```

The value is stored as a plain object. The `storageGet` abstraction in `storage.ts` reads via `chrome.storage.local.get` and casts the result to `string | null` — but if the stored value is an object, it comes back as an object at runtime, not a string. We need a JSON string so App.tsx can safely parse it.

We also rename the key from `pendingAnalyze` to `pendingAssignment` (cleaner name, matches the feature intent).

**Step 1: Update the click handler in content.js**

Find the click handler (lines 56-59):
```js
btn.addEventListener('click', () => {
  chrome.storage.local.set({ pendingAnalyze: { courseId, assignmentId } });
  chrome.runtime.sendMessage({ action: 'openPopup' });
});
```

Replace with:
```js
btn.addEventListener('click', () => {
  chrome.storage.local.set({ pendingAssignment: JSON.stringify({ courseId, assignmentId }) });
  chrome.runtime.sendMessage({ action: 'openPopup' });
});
```

**Step 2: Verify the file looks correct**

Read the file back and confirm the click handler stores `pendingAssignment` as a JSON string.

**Step 3: Commit**

```bash
git add apps/extension/public/content.js
git commit -m "feat(extension): store pendingAssignment as JSON string for popup deep-link"
```

---

### Task 2: Read pendingAssignment in App.tsx and navigate on load

**Files:**
- Modify: `apps/extension/src/App.tsx`

**Context:**

Read the full `App.tsx` first. The key areas:
- Imports at the top — add `storageGet` and `storageRemove` imports from `@/lib/storage`
- The `useState` declarations block — add `pendingTarget` state
- After the existing session-hydration `useEffect` — add a new `useEffect` that reads and clears `pendingAssignment` on mount
- The existing auto-navigate `useEffect` that watches `[assignmentInfo, assignments]` — extend it to also handle `pendingTarget`

**Step 1: Add storage imports**

Find the existing import from `@/lib/uiSession`:
```typescript
import { loadUiSession, saveUiSession, type AssignmentDetailSession } from "@/lib/uiSession";
```

Add `storageGet` and `storageRemove` to the storage import line directly below (or create it if it doesn't exist):
```typescript
import { storageGet, storageRemove } from "@/lib/storage";
```

**Step 2: Add pendingTarget state**

Find the block of `useState` declarations inside `App()`. After the line:
```typescript
const [restoreSelectedRef, setRestoreSelectedRef] = useState<{ courseId: string; assignmentId: string } | null>(null);
```

Add:
```typescript
const [pendingTarget, setPendingTarget] = useState<{ courseId: string; assignmentId: string } | null>(null);
```

**Step 3: Add useEffect to read and clear pendingAssignment on mount**

Find the `useEffect` that loads the UI session (the one that calls `loadUiSession()`). Add a new `useEffect` directly after it:

```typescript
// Read and immediately clear any pending deep-link target from the content script
useEffect(() => {
  storageGet("pendingAssignment").then((raw) => {
    if (!raw || typeof raw !== "string") return;
    try {
      const parsed = JSON.parse(raw) as { courseId?: string; assignmentId?: string };
      if (parsed.courseId && parsed.assignmentId) {
        setPendingTarget({ courseId: String(parsed.courseId), assignmentId: String(parsed.assignmentId) });
      }
    } catch { /* malformed — ignore */ }
  });
  storageRemove("pendingAssignment");
}, []);
```

**Step 4: Extend the auto-navigate useEffect to handle pendingTarget**

Find the existing auto-navigate effect:
```typescript
// Auto-navigate to detected Canvas assignment
useEffect(() => {
  if (!assignmentInfo || assignments.length === 0) return;
  const match = assignments.find(
    (a) => String(a.id) === assignmentInfo.assignmentId &&
           (a.courseId === assignmentInfo.courseId || String(a.courseId) === assignmentInfo.courseId)
  );
  if (match) setSelectedAssignment(match);
}, [assignmentInfo, assignments]);
```

Replace it with a version that handles both `assignmentInfo` (URL-based) and `pendingTarget` (storage-based):

```typescript
// Auto-navigate to detected Canvas assignment (from active tab URL or content-script deep-link)
useEffect(() => {
  const target = pendingTarget ?? assignmentInfo;
  if (!target || assignments.length === 0) return;
  const match = assignments.find(
    (a) => String(a.id) === target.assignmentId &&
           (String(a.courseId ?? "") === target.courseId)
  );
  if (match) {
    setSelectedAssignment(match);
    if (pendingTarget) setPendingTarget(null);
  }
}, [assignmentInfo, pendingTarget, assignments]);
```

**Step 5: Verify the file**

Read the modified App.tsx and confirm:
- `storageGet` and `storageRemove` are imported
- `pendingTarget` state is declared
- The mount effect reads and clears `pendingAssignment`
- The auto-navigate effect handles both `pendingTarget` and `assignmentInfo`

**Step 6: Commit**

```bash
git add apps/extension/src/App.tsx
git commit -m "feat(extension): deep-link popup to assignment detail on Open in Assignmint click"
```

---

### Task 3: Build and verify

**Step 1: Build the extension**

```bash
cd apps/extension && npm run build
```

Expected: no TypeScript errors, `✓ built in` output.

**Step 2: Manual verification checklist**

1. Load the unpacked extension from `apps/extension/dist/` in Chrome
2. Navigate to a Canvas assignment page (URL like `/courses/123/assignments/456`)
3. Click "Open in Assignmint"
4. Extension popup opens → should show the assignment detail page directly (not the Today list)
5. Close popup, open it again manually (without clicking the button) → should show Today tab as normal (pending target was cleared)

**Step 3: Commit if any fixes needed**

```bash
git add apps/extension/public/content.js apps/extension/src/App.tsx
git commit -m "fix(extension): open-in-assignmint deep-link cleanup"
```
