import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SignupRequest, LoginRequest, AuthResponse } from "shared";

interface Props {
  onComplete: () => void;
  onSignup: (data: SignupRequest) => Promise<AuthResponse>;
  onLogin: (data: LoginRequest) => Promise<AuthResponse>;
}

export function OnboardingStep1({ onComplete, onSignup, onLogin }: Props) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log(`[onboarding] attempting ${mode} for ${email}`);
      if (mode === "signup") {
        await onSignup({ email, password });
      } else {
        await onLogin({ email, password });
      }
      console.log(`[onboarding] ${mode} succeeded, advancing to step 2`);
      onComplete();
    } catch (err) {
      console.error(`[onboarding] ${mode} failed:`, err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <span className="text-2xl">🌱</span>
      </div>
      <h1 className="text-xl font-bold text-foreground mb-1">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {mode === "signup"
          ? "Step 1 of 2 — create your account"
          : "Sign in to continue to assignmint"}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 text-left">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className={inputClass}
            required
            minLength={8}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <p className="mt-4 text-xs text-muted-foreground">
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
