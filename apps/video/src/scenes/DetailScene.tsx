import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { ExtensionShell } from "../components/ExtensionShell";
import { EXTHeader } from "../components/EXTHeader";
import { EXTNav } from "../components/EXTNav";
import { SceneCaption } from "../components/SceneCaption";
import { FONT } from "../fonts";
import { EXT } from "../colors";

const DetailContent: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const headerP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const bodyP = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 24 });
  const btnP = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 160 }, durationInFrames: 26 });

  // Sparkle / pulse on analyze button
  const btnGlow = interpolate(frame, [35, 55, 75], [0.6, 1.0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: 390, height: 600, background: EXT.bg, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: FONT.sans }}>
      <EXTHeader showBack backLabel="ECON 101" showSparkle={frame > 40} />

      <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        {/* Assignment header */}
        <div style={{ opacity: interpolate(headerP, [0, 1], [0, 1]), transform: `translateY(${interpolate(headerP, [0, 1], [10, 0])}px)` }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: EXT.fg, margin: "0 0 8px", lineHeight: 1.35 }}>
            Final Paper: Supply and Demand Analysis
          </h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["150 pts", "Due Mar 15", "online_upload"].map((tag) => (
              <span key={tag} style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 5,
                background: EXT.mutedBg, color: EXT.mutedFg, fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description preview card */}
        <div
          style={{
            background: EXT.mutedBg,
            borderRadius: 10,
            padding: 12,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            opacity: interpolate(bodyP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(bodyP, [0, 1], [10, 0])}px)`,
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: EXT.mutedFg, margin: "0 0 4px" }}>
              Description
            </p>
            <p style={{ fontSize: 11, color: `${EXT.fg}99`, lineHeight: 1.5, margin: 0 }}>
              Write a 2,500-word analysis of supply and demand dynamics in a market of your choice. Include elasticity calculations, equilibrium analysis, and policy implications...
            </p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={EXT.mutedFg} strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Analyze button */}
        <div
          style={{
            width: "100%",
            height: 42,
            borderRadius: 10,
            background: EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            opacity: interpolate(btnP, [0, 1], [0, 1]) * btnGlow,
            transform: `scale(${interpolate(btnP, [0, 1], [0.9, 1])})`,
            boxShadow: `0 6px 20px rgba(76,168,122,${0.25 + (btnGlow - 0.6) * 0.4})`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="none">
            <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Analyze with AI</span>
        </div>
      </div>

      <EXTNav active="today" />
    </div>
  );
};

export const DetailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={530} />
      <ExtensionShell scale={1.22} opacity={interpolate(entryP, [0, 1], [0, 1])}>
        <DetailContent frame={frame} fps={fps} />
      </ExtensionShell>
      <SceneCaption title="One click to unlock AI insights" subtitle="Works on any Canvas assignment" delay={20} />
    </AbsoluteFill>
  );
};
