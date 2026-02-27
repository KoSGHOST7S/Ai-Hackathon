import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
};

function Avatar({ initials, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold flex items-center justify-center shrink-0 select-none",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
