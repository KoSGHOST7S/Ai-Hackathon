import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { SubPageHeader } from "./SubPageHeader";

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
      <SubPageHeader title="Edit Canvas Connection" onBack={onBack} />

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
            placeholder="Enter your Canvas API token"
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
