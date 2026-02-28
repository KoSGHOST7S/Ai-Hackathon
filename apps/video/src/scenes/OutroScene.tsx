import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { FONT } from "../fonts";
import { VID, EXT } from "../colors";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 38,
  });
  const titleP = spring({
    frame: frame - 14,
    fps,
    config: { damping: 200 },
    durationInFrames: 28,
  });
  const lineP = spring({
    frame: frame - 26,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const tagP = spring({
    frame: frame - 32,
    fps,
    config: { damping: 200 },
    durationInFrames: 24,
  });
  const powP = spring({
    frame: frame - 46,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const chromeP = spring({
    frame: frame - 58,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const hackP = spring({
    frame: frame - 70,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={480} />

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
        {/* Logo */}
        <div
          style={{
            width: 82,
            height: 82,
            borderRadius: 24,
            background: EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            boxShadow:
              "0 16px 48px rgba(76, 168, 122, 0.3), 0 4px 12px rgba(0,0,0,0.08)",
            transform: `scale(${logoP})`,
            opacity: logoP,
          }}
        >
          <span style={{ fontSize: 42 }}>🌱</span>
        </div>

        {/* Brand */}
        <div
          style={{
            opacity: interpolate(titleP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleP, [0, 1], [18, 0])}px)`,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: FONT.serif,
              fontSize: 68,
              fontWeight: 600,
              color: VID.text,
              letterSpacing: "-2px",
            }}
          >
            Assign
          </span>
          <span
            style={{
              fontFamily: FONT.serif,
              fontSize: 68,
              fontWeight: 600,
              color: EXT.primary,
              letterSpacing: "-2px",
            }}
          >
            mint.ai
          </span>
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: interpolate(lineP, [0, 1], [0, 160]),
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${VID.line}, transparent)`,
            marginBottom: 16,
          }}
        />

        {/* Tagline */}
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 18,
            color: VID.textMuted,
            margin: "0 0 32px",
            fontWeight: 400,
            opacity: interpolate(tagP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(tagP, [0, 1], [10, 0])}px)`,
          }}
        >
          AI-powered assignment analysis for Canvas LMS.
        </p>

        {/* Powered by badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 18px",
            borderRadius: 100,
            border: `1px solid ${VID.line}`,
            background: VID.surface,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: 12,
            opacity: interpolate(powP, [0, 1], [0, 1]),
            transform: `scale(${interpolate(powP, [0, 1], [0.92, 1])})`,
          }}
        >
          <span style={{ fontSize: 14 }}>⚡</span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: 13,
              fontWeight: 500,
              color: VID.textMuted,
            }}
          >
            Powered by IBM watsonx Granite
          </span>
        </div>

        {/* Chrome badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 100,
            border: `1px solid ${VID.line}`,
            background: VID.surface,
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            marginBottom: 14,
            opacity: interpolate(chromeP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(chromeP, [0, 1], [10, 0])}px)`,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={VID.textDim}
            stroke="none"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" fill={VID.surface} />
          </svg>
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: 12,
              color: VID.textMuted,
            }}
          >
            Available as a Chrome Extension
          </span>
        </div>

        {/* Hackathon tag */}
        <div
          style={{
            opacity: interpolate(hackP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(hackP, [0, 1], [8, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: 11,
              color: VID.textDim,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Built for AI Hackathon 2025
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
