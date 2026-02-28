import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Send } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseFile } from "@/lib/api";

const REVIEW_STEPS = ["Scoring submission…", "Writing feedback…", "Validating review…"];

interface Props {
  assignmentName: string;
  courseId: string;
  assignmentId: string;
  jwt: string;
  reviewStep: number;
  reviewStatus: string;
  reviewError: string | null;
  onSubmit: (body: { submission_text?: string; submission_files?: Array<{ name: string; text: string }> }) => void;
  onBack: () => void;
}

export function SubmitPage({ assignmentName, courseId, assignmentId, jwt, reviewStep, reviewStatus, reviewError, onSubmit, onBack }: Props) {
  const [mode, setMode] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setParsing(true);
    setParseError(null);
    setFileName(file.name);
    try {
      if (file.name.endsWith(".txt")) {
        setFileText(await file.text());
      } else {
        const data = await parseFile(jwt, file);
        setFileText(data.text);
      }
    } catch (err) {
      setFileText(null);
      setFileName(null);
      setParseError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  }

  function handleSubmit() {
    if (mode === "text" && text.trim()) {
      onSubmit({ submission_text: text.trim() });
    } else if (mode === "file" && fileText && fileName) {
      onSubmit({ submission_files: [{ name: fileName, text: fileText }] });
    }
  }

  const canSubmit = (mode === "text" && text.trim().length > 0) || (mode === "file" && fileText !== null);

  if (reviewStatus === "loading") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubPageHeader title="Reviewing…" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <div className="w-full flex flex-col gap-2">
            {REVIEW_STEPS.map((label, i) => (
              <div key={label} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= reviewStep ? "opacity-100" : "opacity-30"}`}>
                {i < reviewStep ? (
                  <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-primary-foreground font-bold">✓</span>
                  </div>
                ) : i === reviewStep ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-muted-foreground/30 shrink-0" />
                )}
                <span className={i === reviewStep ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reviewStatus === "error") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubPageHeader title="Review Failed" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-sm text-destructive font-medium">Review failed</p>
          <p className="text-xs text-muted-foreground">{reviewError}</p>
          <Button variant="outline" onClick={onBack}>Go back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Submit for Review" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Upload or paste your work for <span className="font-medium text-foreground">{assignmentName}</span>. AI will score it against the rubric.
        </p>

        {/* Mode tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setMode("file")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mode === "file" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Upload File
          </button>
          <button
            onClick={() => setMode("text")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mode === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Paste Text
          </button>
        </div>

        {mode === "file" && (
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Card
              className="shadow-none border-dashed cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <div className="p-6 flex flex-col items-center gap-2 text-center">
                {parsing ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : fileName ? (
                  <>
                    <FileText className="h-6 w-6 text-primary" />
                    <p className="text-xs font-medium text-foreground">{fileName}</p>
                    <p className="text-[10px] text-muted-foreground">Click to replace</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to upload .pdf, .docx, or .txt</p>
                  </>
                )}
              </div>
            </Card>
            {parseError && (
              <p className="text-xs text-destructive">{parseError}</p>
            )}
          </div>
        )}

        {mode === "text" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your work here…"
            className="w-full min-h-[160px] text-xs bg-muted rounded-lg p-3 outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground resize-none"
          />
        )}

        <Button className="w-full gap-2" disabled={!canSubmit} onClick={handleSubmit}>
          <Send className="h-3.5 w-3.5" />
          Submit for Review
        </Button>
      </div>
    </div>
  );
}
