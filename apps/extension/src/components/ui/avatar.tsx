import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
};

function Avatar({ initials, src, size = "md", className, ...props }: AvatarProps) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const showImage = src && !imgFailed;

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shrink-0 select-none flex items-center justify-center",
        !showImage && "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={initials}
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}

export { Avatar };
