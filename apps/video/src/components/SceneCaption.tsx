import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../fonts";
import { VID } from "../colors";

interface Props {
  title: string;
  subtitle?: string;
  delay?: number;
}

export const SceneCaption: React.FC<Props> = ({ title, subtitle, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 52,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          fontFamily: FONT.sans,
          fontSize: 22,
          fontWeight: 600,
          color: VID.white,
          margin: 0,
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 15,
            fontWeight: 400,
            color: VID.textDim,
            margin: "6px 0 0",
            letterSpacing: "0px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
