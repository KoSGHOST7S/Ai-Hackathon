import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { ExtensionShell } from "../components/ExtensionShell";
import { SceneCaption } from "../components/SceneCaption";
import { FONT } from "../fonts";
import { EXT, VID } from "../colors";

const WelcomeContent: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const logoS = spring({ frame, fps, config: { damping: 10, stiffness: 130 }, durationInFrames: 35 });
  const titleP = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 28 });
  const tagP = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 25 });
  const btnP = spring({ frame: frame - 36, fps, config: { damping: 200 }, durationInFrames: 22 });
  const linkP = spring({ frame: frame - 48, fps, config: { damping: 200 }, durationInFrames: 20 });

  return (
    <div
      style={{
        width: 390,
        height: 600,
        background: EXT.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px",
        gap: 0,
        boxSizing: "border-box",
        fontFamily: FONT.sans,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: EXT.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 12px 32px rgba(76,168,122,0.35)",
          transform: `scale(${logoS})`,
          opacity: logoS,
        }}
      >
        <span style={{ fontSize: 38 }}>🌱</span>
      </div>

      {/* Title */}
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: 28,
          fontFamily: FONT.serif,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          opacity: interpolate(titleP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleP, [0, 1], [16, 0])}px)`,
        }}
      >
        <span style={{ color: EXT.fg }}>Assign</span>
        <span style={{ color: EXT.primary }}>mint.ai</span>
      </h1>

      {/* Tagline */}
      <p
        style={{
          margin: "0 0 40px",
          fontSize: 15,
          color: EXT.mutedFg,
          opacity: interpolate(tagP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(tagP, [0, 1], [12, 0])}px)`,
        }}
      >
        Your assignments, organized.
      </p>

      {/* CTA Button */}
      <div
        style={{
          width: "100%",
          opacity: interpolate(btnP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(btnP, [0, 1], [12, 0])}px)`,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 44,
            borderRadius: 10,
            background: EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(76,168,122,0.3)",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Get Started</span>
        </div>
      </div>

      {/* Sign in link */}
      <p
        style={{
          fontSize: 13,
          color: EXT.mutedFg,
          margin: 0,
          opacity: interpolate(linkP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(linkP, [0, 1], [8, 0])}px)`,
        }}
      >
        Already have an account?{" "}
        <span style={{ color: EXT.primary, textDecoration: "underline", fontWeight: 500 }}>
          Sign in
        </span>
      </p>
    </div>
  );
};

export const WelcomeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extension rises up from below
  const entryProgress = spring({ frame, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 45 });
  const translateY = interpolate(entryProgress, [0, 1], [220, 0]);
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const tilt = interpolate(entryProgress, [0, 1], [10, 0]);

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={530} />
      <ExtensionShell scale={1.22} translateY={translateY} opacity={opacity} tilt={tilt}>
        <WelcomeContent frame={frame} fps={fps} />
      </ExtensionShell>
      <SceneCaption title="Meet Assignmint.ai" subtitle="Your AI-powered study companion for Canvas LMS" delay={30} />
    </AbsoluteFill>
  );
};
