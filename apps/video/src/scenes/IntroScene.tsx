import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { FONT } from "../fonts";
import { VID, EXT } from "../colors";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo bounce in
  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 140 }, durationInFrames: 40 });
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Title slide up
  const titleProgress = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 30 });
  const titleY = interpolate(titleProgress, [0, 1], [24, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Tagline
  const tagProgress = spring({ frame: frame - 34, fps, config: { damping: 200 }, durationInFrames: 25 });
  const tagY = interpolate(tagProgress, [0, 1], [18, 0]);
  const tagOpacity = interpolate(tagProgress, [0, 1], [0, 1]);

  // Pill badge
  const badgeProgress = spring({ frame: frame - 52, fps, config: { damping: 200 }, durationInFrames: 22 });
  const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.85, 1]);

  // Fade out at end
  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Background glowX={960} glowY={520} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            background: EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            boxShadow: `0 20px 60px rgba(76,168,122,0.45), 0 4px 16px rgba(0,0,0,0.3)`,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <span style={{ fontSize: 48, lineHeight: 1 }}>🌱</span>
        </div>

        {/* Brand name */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: FONT.serif,
              fontSize: 72,
              fontWeight: 700,
              color: VID.white,
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Assign
          </span>
          <span
            style={{
              fontFamily: FONT.serif,
              fontSize: 72,
              fontWeight: 700,
              color: EXT.primary,
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            mint.ai
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 24,
            fontWeight: 400,
            color: VID.textDim,
            margin: "0 0 40px",
            letterSpacing: "0.2px",
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          Your assignments, finally organized.
        </p>

        {/* AI badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 100,
            border: `1px solid rgba(76,168,122,0.35)`,
            background: "rgba(76,168,122,0.08)",
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
          }}
        >
          <span style={{ fontSize: 14 }}>⚡</span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: 13,
              fontWeight: 500,
              color: VID.textDim,
              letterSpacing: "0.3px",
            }}
          >
            Powered by IBM watsonx Granite
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
