# Canvas Validation & Edit Connection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Validate the Canvas API key during onboarding and provide an Edit Canvas Connection sub-page in the profile.

**Architecture:** The server's `PUT /auth/canvas-config` is changed from soft-failing to hard-failing when Canvas credentials are invalid — the extension's existing error display surfaces the message. A new `EditCanvasView` component mirrors `OnboardingStep2` but lives inside the Me tab, rendered when `App.tsx` sets `canvasEdit=true`.

**Tech Stack:** React + TypeScript (extension), Express + Prisma (server), Tailwind + shadcn/ui

---

### Task 1: Harden Canvas credential validation on the server

**Files:**
- Modify: `apps/server/src/routes/auth.ts:96-114`

**Step 1: Locate the profile-fetch block in `PUT /auth/canvas-config`**

In `apps/server/src/routes/auth.ts`, find the try/catch around the Canvas profile fetch (lines ~96-114). Currently the catch just logs a warning and continues saving.

**Step 2: Change the validation to hard-fail on bad credentials**

Replace the inner try/catch so an invalid key returns a 400 before saving:

```typescript
// Validate Canvas credentials by fetching user profile
let canvasName: string | null = null;
let canvasAvatarUrl: string | null = null;
try {
  const profileRes = await fetch(`${parsedOrigin}/api/v1/users/self/profile`, {
    headers: { Authorization: `Bearer ${canvasApiKey}` },
  });
  if (!profileRes.ok) {
    if (profileRes.status === 401 || profileRes.status === 403) {
      res.status(400).json({ error: "Invalid Canvas API key — please check your token and try again" });
      return;
    }
    // Other Canvas errors (5xx, etc.) — still reject so user knows something is wrong
    res.status(400).json({ error: `Could not reach Canvas (HTTP ${profileRes.status}) — check your Canvas URL` });
    return;
  }
  const profile = await profileRes.json() as { name?: string; avatar_url?: string };
  canvasName = profile.name ?? null;
  canvasAvatarUrl = profile.avatar_url ?? null;
  console.log(`[canvas-config] fetched profile for "${canvasName}"`);
} catch (err) {
  console.warn("[canvas-config] could not reach Canvas:", err);
  res.status(400).json({ error: "Could not reach Canvas — check your Canvas URL and network" });
  return;
}
```

**Step 3: Manual test**

Start the server. Submit an invalid API key to `PUT /auth/canvas-config` (curl or via the extension). Verify a 400 with the error message is returned and nothing is saved to the DB.

Submit a valid key — verify it saves and returns `{ ok: true }`.

**Step 4: Commit**

```bash
git add apps/server/src/routes/auth.ts
git commit -m "feat(server): hard-validate Canvas credentials before saving config"
```

---

### Task 2: Create `EditCanvasView` component

**Files:**
- Create: `apps/extension/src/components/views/EditCanvasView.tsx`

**Step 1: Write the component**

This is a sub-page that looks like OnboardingStep2 adapted for the edit context — with a back arrow header and pre-filled URL field. The API key field is always blank (never pre-fill secrets).

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Props {
  jwt: string;
  currentBaseUrl: string | null;
  onBack: () => void;
  onSaved: () => void;
}

export function EditCanvasView({ jwt, currentBaseUrl, onBack, onSaved }: Props) {
  const [canvasBaseUrl, setCanvasBaseUrl] = useState(currentBaseUrl ?? "");
  const [canvasApiKey, setCanvasApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch(
        "/auth/canvas-config",
        { method: "PUT", body: JSON.stringify({ canvasBaseUrl, canvasApiKey }) },
        jwt
      );
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-page header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">Edit Canvas Connection</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="edit-canvas-url" className="text-sm font-medium">
            Canvas Base URL
          </label>
          <input
            id="edit-canvas-url"
            type="url"
            placeholder="https://bw.instructure.com"
            value={canvasBaseUrl}
            onChange={(e) => { setCanvasBaseUrl(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
          <p className="text-xs text-muted-foreground">Your school's Canvas domain</p>
        </div>
        <div className="space-y-1">
          <label htmlFor="edit-canvas-key" className="text-sm font-medium">
            Canvas API Key
          </label>
          <input
            id="edit-canvas-key"
            type="password"
            placeholder="Enter new token to replace existing"
            value={canvasApiKey}
            onChange={(e) => { setCanvasApiKey(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
          <p className="text-xs text-muted-foreground">
            Generate one in Canvas → Account → Settings → New Access Token
          </p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Validating…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/components/views/EditCanvasView.tsx
git commit -m "feat(extension): add EditCanvasView sub-page component"
```

---

### Task 3: Add Edit button to `MeView`

**Files:**
- Modify: `apps/extension/src/components/views/MeView.tsx`

**Step 1: Add `onEditCanvas` prop to the Props interface**

```typescript
interface Props {
  user: { id: string; email: string } | null;
  meData: MeResponse | null;
  cachedAvatarUrl?: string | null;
  assignmentCount: number;
  analyzedCount: number;
  courseCount: number;
  onLogout: () => void;
  onEditCanvas: () => void;   // <-- add this
}
```

**Step 2: Destructure the new prop**

```typescript
export function MeView({ user, meData, cachedAvatarUrl, assignmentCount, analyzedCount, courseCount, onLogout, onEditCanvas }: Props) {
```

**Step 3: Update the Canvas card to include an Edit button**

Replace the existing Canvas card `<Card>` block with:

```tsx
<Card className="shadow-none">
  <div className="p-3 flex items-center gap-3">
    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <GraduationCap className="h-4 w-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-foreground">Canvas LMS</p>
      {meData?.canvasBaseUrl ? (
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{meData.canvasBaseUrl}</p>
      ) : (
        <p className="text-[10px] text-muted-foreground mt-0.5">Not connected</p>
      )}
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {meData?.canvasBaseUrl && (
        <div className="h-2 w-2 rounded-full bg-emerald-500" title="Connected" />
      )}
      <button
        type="button"
        onClick={onEditCanvas}
        className="text-[10px] font-medium text-primary hover:underline"
      >
        Edit
      </button>
    </div>
  </div>
</Card>
```

**Step 4: Commit**

```bash
git add apps/extension/src/components/views/MeView.tsx
git commit -m "feat(extension): add Edit button to Canvas card in MeView"
```

---

### Task 4: Wire up `EditCanvasView` in `App.tsx`

**Files:**
- Modify: `apps/extension/src/App.tsx`

**Step 1: Import `EditCanvasView`**

Add at the top with the other view imports:
```typescript
import { EditCanvasView } from "@/components/views/EditCanvasView";
```

**Step 2: Add `canvasEdit` state**

After the existing `useState` declarations inside `App()`:
```typescript
const [canvasEdit, setCanvasEdit] = useState(false);
```

**Step 3: Reset `canvasEdit` when tab changes away from "me"**

Find the `setTab` handler usage at the BottomNav and wrap it so switching tabs clears the sub-page:
```typescript
// replace the direct onChange={setTab} on BottomNav with:
onChange={(t) => { setCanvasEdit(false); setTab(t); }}
```

**Step 4: Pass `onEditCanvas` to `MeView` and render `EditCanvasView` when active**

Find the `{tab === "me" && <MeView ... />}` block and replace it:

```tsx
{tab === "me" && (
  canvasEdit ? (
    <EditCanvasView
      jwt={jwt!}
      currentBaseUrl={meData?.canvasBaseUrl ?? null}
      onBack={() => setCanvasEdit(false)}
      onSaved={async () => {
        setCanvasEdit(false);
        if (jwt) {
          try {
            const me = await apiFetch<MeResponse>("/auth/me", {}, jwt);
            applyMe(me);
          } catch { /* non-fatal */ }
        }
      }}
    />
  ) : (
    <MeView
      user={user}
      meData={meData}
      cachedAvatarUrl={avatarUrl}
      assignmentCount={assignments.length}
      analyzedCount={analyzedKeys.size}
      courseCount={new Set(assignments.map((a) => a.courseId).filter(Boolean)).size}
      onLogout={async () => {
        await clearProfile();
        logout();
      }}
      onEditCanvas={() => setCanvasEdit(true)}
    />
  )
)}
```

**Step 5: Commit**

```bash
git add apps/extension/src/App.tsx
git commit -m "feat(extension): wire EditCanvasView sub-page into Me tab"
```

---

### Task 5: Verify end-to-end

**Step 1: Build the extension**

```bash
cd apps/extension && npm run build
```

Expected: no TypeScript errors, build succeeds.

**Step 2: Manual onboarding test**

Load the extension, sign up, enter an **invalid** Canvas API key → expect error message "Invalid Canvas API key — please check your token and try again". Do NOT proceed to dashboard.

Enter a **valid** key → expect successful onboarding, dashboard loads.

**Step 3: Manual edit test**

Go to Profile tab → Canvas card → click "Edit". Verify sub-page appears with back arrow and URL pre-filled. Enter an invalid key → expect error. Enter a valid key → expect success, profile refreshes, returns to profile page.

**Step 4: Final commit (if any cleanup needed)**

```bash
git add -p
git commit -m "chore: canvas validation and edit connection cleanup"
```
