import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SetupViewProps {
  onComplete: () => void;
}

export function SetupView({ onComplete }: SetupViewProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedUrl = new URL(url);
      // store just the origin to be safe (e.g. "https://bw.instructure.com")
      localStorage.setItem("canvasBaseUrl", parsedUrl.origin);
      onComplete();
    } catch (err) {
      setError("Please enter a valid URL (e.g., https://bw.instructure.com)");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 text-center h-full bg-background overflow-hidden">
      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <span className="text-2xl">🌱</span>
      </div>
      
      <h1 className="text-xl font-bold text-foreground mb-2">Welcome to assignmint</h1>
      <p className="text-sm text-muted-foreground mb-8">
        To get started, please enter your school's Canvas base URL so we can detect assignments automatically.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2 text-left">
          <label htmlFor="url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Canvas Base URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://bw.instructure.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        
        <Button type="submit" className="w-full">
          Get Started
        </Button>
      </form>
    </div>
  );
}
