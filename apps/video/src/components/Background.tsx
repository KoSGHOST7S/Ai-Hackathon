import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { VID } from "../colors";

const NUM_PARTICLES = 28;

const PARTICLES = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
  id: i,
  x: (((i * 137.5) % 100) / 100) * 1920,
  y: 1080 + ((i * 73.1) % 300),
  size: 2 + ((i * 31) % 4),
  speed: 0.25 + ((i * 0.17) % 0.35),
  opacity: 0.12 + ((i * 0.05) % 0.15),
}));

export const Background: React.FC<{ glowX?: number; glowY?: number }> = ({
  glowX = 960,
  glowY = 540,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${VID.bgMid} 0%, ${VID.bg} 60%)` }}>
      {/* Subtle radial vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Ambient glow behind extension */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${VID.glow} 0%, ${VID.glowSoft} 45%, transparent 70%)`,
          left: glowX - 350,
          top: glowY - 350,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => {
        const drift = (frame * p.speed) % (1080 + 300);
        const py = p.y - drift;
        const wrappedY = py > -10 ? py : py + 1380;
        const xWave = Math.sin(frame * 0.015 + p.id * 0.8) * 14;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x + xWave,
              top: wrappedY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: VID.accent,
              opacity: p.opacity,
            }}
          />
        );
      })}

      {/* Subtle horizontal scan line */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
