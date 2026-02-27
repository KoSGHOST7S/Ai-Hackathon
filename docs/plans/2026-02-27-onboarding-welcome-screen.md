# Onboarding Welcome Screen Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a polished welcome screen as the first step of onboarding with smooth horizontal slide transitions between all steps and entrance animations throughout.

**Architecture:** `SetupView` becomes the slide orchestrator — it owns a step index (0=welcome, 1=account, 2=canvas) and slides a 300%-wide flex row left via CSS `transform: translateX`. Each step component receives an `isActive` prop and uses `animation-play-state` to fire entrance animations only when visible. A new `OnboardingWelcome` component is added; `OnboardingStep1/2` are polished in-place.

**Tech Stack:** React, Tailwind CSS, CSS keyframe animations (no new dependencies)

---

## Files

- Modify: `apps/extension/src/index.css`
- Create: `apps/extension/src/components/views/OnboardingWelcome.tsx`
- Modify: `apps/extension/src/components/views/SetupView.tsx`
- Modify: `apps/extension/src/components/views/OnboardingStep1.tsx`
- Modify: `apps/extension/src/components/views/OnboardingStep2.tsx`

---

### Task 1: Add CSS animation keyframes to index.css

**Files:**
- Modify: `apps/extension/src/index.css`

Add three keyframes and a utility for animation delay support. Place inside a new `@layer utilities` block after the existing `@layer base` blocks.

**Step 1: Add keyframes and animation utilities**

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.82); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@layer utilities {
  .animate-fade-in-up {
    animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-scale-in {
    animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .animate-fade-in {
    animation: fadeIn 0.35s ease both;
  }
}
```

**Step 2: Verify no build errors**

Run: `cd apps/extension && npx tsc --noEmit`
Expected: no errors

---

### Task 2: Create OnboardingWelcome.tsx

**Files:**
- Create: `apps/extension/src/components/views/OnboardingWelcome.tsx`

Brand splash screen. All content animates in with staggered delays controlled by `animation-play-state` (paused when not the active step, running when active).

```tsx
import { Button } from "@/components/ui/button";

interface Props {
  isActive: boolean;
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function OnboardingWelcome({ isActive, onGetStarted, onSignIn }: Props) {
  const play = isActive ? "running" : "paused";

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center select-none">
      {/* Logo mark */}
      <div
        className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg animate-scale-in"
        style={{ animationPlayState: play, animationDelay: "0ms" }}
      >
        <span className="text-4xl" role="img" aria-label="assignmint">🌱</span>
      </div>

      {/* Brand name */}
      <h1
        className="text-3xl font-bold tracking-tight text-foreground mb-2 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "80ms" }}
      >
        assignmint
      </h1>

      {/* Tagline */}
      <p
        className="text-base text-muted-foreground mb-10 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "160ms" }}
      >
        Your assignments, organized.
      </p>

      {/* CTA */}
      <div
        className="w-full max-w-xs animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "240ms" }}
      >
        <Button className="w-full h-11 text-base font-semibold" onClick={onGetStarted}>
          Get Started
        </Button>
      </div>

      {/* Sign-in link */}
      <p
        className="mt-4 text-sm text-muted-foreground animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "320ms" }}
      >
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignIn}
          className="text-primary underline underline-offset-2 font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
```

---

### Task 3: Refactor SetupView.tsx into slide orchestrator

**Files:**
- Modify: `apps/extension/src/components/views/SetupView.tsx`

Replace the simple jwt-based conditional with a 3-step slide system. The outer container is `overflow-hidden`; inner row is 300% wide and slides via `translateX`. `App.tsx` interface is unchanged.

```tsx
import { useState } from "react";
import { OnboardingWelcome } from "./OnboardingWelcome";
import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";
import type { SignupRequest, LoginRequest, AuthResponse } from "shared";

interface Props {
  onComplete: () => void;
  jwt: string | null;
  onStep1Complete: () => void;
  onSignup: (data: SignupRequest) => Promise<AuthResponse>;
  onLogin: (data: LoginRequest) => Promise<AuthResponse>;
}

type StepIndex = 0 | 1 | 2;

export function SetupView({ onComplete, jwt, onStep1Complete, onSignup, onLogin }: Props) {
  // If JWT already present (logged in but no Canvas config), skip to canvas step
  const [step, setStep] = useState<StepIndex>(jwt ? 2 : 0);
  const [accountMode, setAccountMode] = useState<"signup" | "login">("signup");

  const goToAccount = (mode: "signup" | "login") => {
    setAccountMode(mode);
    setStep(1);
  };

  const handleAccountComplete = () => {
    onStep1Complete();
    setStep(2);
  };

  return (
    <div className="h-full overflow-hidden">
      <div
        className="flex h-full"
        style={{
          width: "300%",
          transform: `translateX(-${(step / 3) * 100}%)`,
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="h-full" style={{ width: "33.333%" }}>
          <OnboardingWelcome
            isActive={step === 0}
            onGetStarted={() => goToAccount("signup")}
            onSignIn={() => goToAccount("login")}
          />
        </div>
        <div className="h-full" style={{ width: "33.333%" }}>
          <OnboardingStep1
            isActive={step === 1}
            initialMode={accountMode}
            onComplete={handleAccountComplete}
            onSignup={onSignup}
            onLogin={onLogin}
          />
        </div>
        <div className="h-full" style={{ width: "33.333%" }}>
          <OnboardingStep2
            isActive={step === 2}
            jwt={jwt ?? ""}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
}
```

---

### Task 4: Polish OnboardingStep1.tsx

**Files:**
- Modify: `apps/extension/src/components/views/OnboardingStep1.tsx`

Add `isActive` + `initialMode` props. Use `useEffect` to reset form when step becomes active (so sign-in vs sign-up mode is correct when navigating from welcome). Add staggered entrance animations.

```tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { SignupRequest, LoginRequest, AuthResponse } from "shared";

interface Props {
  isActive: boolean;
  initialMode?: "signup" | "login";
  onComplete: () => void;
  onSignup: (data: SignupRequest) => Promise<AuthResponse>;
  onLogin: (data: LoginRequest) => Promise<AuthResponse>;
}

export function OnboardingStep1({
  isActive,
  initialMode = "signup",
  onComplete,
  onSignup,
  onLogin,
}: Props) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isActive) {
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [isActive, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await onSignup({ email, password });
      } else {
        await onLogin({ email, password });
      }
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const play = isActive ? "running" : "paused";

  const inputClass =
    "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-colors";

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {/* Step indicator */}
      <div
        className="flex items-center gap-1.5 mb-6 animate-fade-in"
        style={{ animationPlayState: play, animationDelay: "0ms" }}
      >
        <div className="w-6 h-1.5 rounded-full bg-primary" />
        <div className="w-6 h-1.5 rounded-full bg-border" />
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-4 animate-scale-in"
        style={{ animationPlayState: play, animationDelay: "40ms" }}
      >
        <span className="text-3xl">🌱</span>
      </div>

      {/* Title */}
      <h1
        className="text-xl font-bold text-foreground mb-1 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "100ms" }}
      >
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p
        className="text-sm text-muted-foreground mb-6 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "140ms" }}
      >
        {mode === "signup"
          ? "Step 1 of 2 — create your account"
          : "Sign in to continue to assignmint"}
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-3 text-left animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "180ms" }}
      >
        <div className="space-y-1">
          <label htmlFor="ob1-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="ob1-email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="ob1-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="ob1-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className={inputClass}
            required
            minLength={8}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? "Please wait…"
            : mode === "signup"
            ? "Create Account"
            : "Sign In"}
        </Button>
      </form>

      {/* Mode toggle */}
      <p
        className="mt-4 text-xs text-muted-foreground animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "220ms" }}
      >
        {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
          className="text-primary underline underline-offset-2"
        >
          {mode === "signup" ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
```

---

### Task 5: Polish OnboardingStep2.tsx

**Files:**
- Modify: `apps/extension/src/components/views/OnboardingStep2.tsx`

Add `isActive` prop and entrance animations. Add step indicator (second dot filled).

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface Props {
  isActive: boolean;
  jwt: string;
  onComplete: () => void;
}

export function OnboardingStep2({ isActive, jwt, onComplete }: Props) {
  const [canvasBaseUrl, setCanvasBaseUrl] = useState("");
  const [canvasApiKey, setCanvasApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const play = isActive ? "running" : "paused";

  const inputClass =
    "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-colors";

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {/* Step indicator */}
      <div
        className="flex items-center gap-1.5 mb-6 animate-fade-in"
        style={{ animationPlayState: play, animationDelay: "0ms" }}
      >
        <div className="w-6 h-1.5 rounded-full bg-primary/40" />
        <div className="w-6 h-1.5 rounded-full bg-primary" />
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-4 animate-scale-in"
        style={{ animationPlayState: play, animationDelay: "40ms" }}
      >
        <span className="text-3xl">🎓</span>
      </div>

      {/* Title */}
      <h1
        className="text-xl font-bold text-foreground mb-1 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "100ms" }}
      >
        Connect Canvas
      </h1>
      <p
        className="text-sm text-muted-foreground mb-6 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "140ms" }}
      >
        Step 2 of 2 — link your Canvas so assignmint can fetch your assignments
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-3 text-left animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "180ms" }}
      >
        <div className="space-y-1">
          <label htmlFor="ob2-url" className="text-sm font-medium">
            Canvas Base URL
          </label>
          <input
            id="ob2-url"
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
          <label htmlFor="ob2-key" className="text-sm font-medium">
            Canvas API Key
          </label>
          <input
            id="ob2-key"
            type="password"
            placeholder="••••••••••••••••"
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
          {loading ? "Saving…" : "Connect Canvas"}
        </Button>
      </form>
    </div>
  );
}
```

---

### Task 6: Verify build

**Step 1: Type-check**

Run: `cd apps/extension && npx tsc --noEmit`
Expected: no errors

**Step 2: Build**

Run: `cd apps/extension && npm run build`
Expected: successful build output

---

## Notes

- `App.tsx` requires **no changes** — `SetupView` props interface is identical
- The 300%-wide flex row means all 3 step components are always in the DOM; `animation-play-state: paused` prevents entrance animations from firing off-screen
- The `useEffect` in Step1 resets form state when the step becomes active, ensuring the correct mode (signup vs login) is shown based on what the user chose on the welcome screen
- Back navigation is intentionally omitted: once a user starts account creation, returning to welcome would be confusing UX
