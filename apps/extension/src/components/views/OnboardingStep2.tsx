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
            placeholder="https://example.instructure.com"
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
