import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface Props {
  jwt: string;
  onComplete: () => void;
}

export function OnboardingStep2({ jwt, onComplete }: Props) {
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

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <span className="text-2xl">🎓</span>
      </div>
      <h1 className="text-xl font-bold text-foreground mb-1">Connect Canvas</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Step 2 of 2 — link your Canvas account so assignmint can fetch your assignments
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 text-left">
        <div className="space-y-1">
          <label htmlFor="baseUrl" className="text-sm font-medium">Canvas Base URL</label>
          <input
            id="baseUrl"
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
          <label htmlFor="apiKey" className="text-sm font-medium">Canvas API Key</label>
          <input
            id="apiKey"
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
