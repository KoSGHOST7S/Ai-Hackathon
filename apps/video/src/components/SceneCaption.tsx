import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../fonts";
import { VID } from "../colors";

interface Props {
  title: string;
  subtitle?: string;
  delay?: number;
  position?: "bottom" | "bottom-left" | "top-left";
}

export const SceneCaption: React.FC<Props> = ({
  title,
  subtitle,
  delay = 0,
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [16, 0]);

  const posStyles: React.CSSProperties =
    position === "top-left"
      ? { top: 60, left: 80, textAlign: "left" }
      : position === "bottom-left"
        ? { bottom: 60, left: 80, textAlign: "left" }
        : { bottom: 56, left: 0, right: 0, textAlign: "center" };

  return (
    <div
      style={{
        position: "absolute",
        ...posStyles,
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          fontFamily: FONT.sans,
          fontSize: 18,
          fontWeight: 500,
          color: VID.textMuted,
          margin: 0,
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 13,
            fontWeight: 400,
            color: VID.textDim,
            margin: "4px 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
