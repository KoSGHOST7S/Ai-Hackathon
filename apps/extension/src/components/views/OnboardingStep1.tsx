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
        {error && <p className="text-sm text-destructive">{error}</p>}
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
