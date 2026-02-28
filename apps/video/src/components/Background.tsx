import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { VID } from "../colors";

export const Background: React.FC<{
  glowX?: number;
  glowY?: number;
}> = ({ glowX = 900, glowY = 400 }) => {
  const frame = useCurrentFrame();

  const blob1X = glowX + Math.sin(frame * 0.008) * 40;
  const blob1Y = glowY + Math.cos(frame * 0.006) * 30;
  const blob2X = 1920 - glowX + Math.cos(frame * 0.007) * 35;
  const blob2Y = 1080 - glowY + Math.sin(frame * 0.009) * 25;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(155deg, ${VID.bg} 0%, ${VID.bgWarm} 50%, ${VID.bg} 100%)`,
      }}
    >
      {/* Soft mint blob */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${VID.accentMid} 0%, ${VID.accentSoft} 40%, transparent 70%)`,
          left: blob1X - 400,
          top: blob1Y - 400,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Warm blush blob */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${VID.blush} 0%, rgba(244, 136, 90, 0.03) 50%, transparent 70%)`,
          left: blob2X - 300,
          top: blob2Y - 300,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${VID.line} 0.5px, transparent 0.5px)`,
          backgroundSize: "32px 32px",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
