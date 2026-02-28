import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  onBack: () => void;
}

export function SubPageHeader({ title, onBack }: Props) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-border shrink-0">
      <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
        <ArrowLeft className="h-4 w-4" />
      </button>
      <p className="text-sm font-semibold text-foreground">{title}</p>
    </div>
  );
}
