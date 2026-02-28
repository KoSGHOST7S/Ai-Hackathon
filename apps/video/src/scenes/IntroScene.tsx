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

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance with bounce
  const logoP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });
  const logoScale = interpolate(logoP, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(logoP, [0, 1], [0, 1]);

  // Brand name slides in
  const nameP = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const nameX = interpolate(nameP, [0, 1], [40, 0]);
  const nameOpacity = interpolate(nameP, [0, 1], [0, 1]);

  // Decorative line extends
  const lineP = spring({
    frame: frame - 24,
    fps,
    config: { damping: 200 },
    durationInFrames: 35,
  });
  const lineWidth = interpolate(lineP, [0, 1], [0, 200]);

  // Tagline
  const tagP = spring({
    frame: frame - 32,
    fps,
    config: { damping: 200 },
    durationInFrames: 28,
  });
  const tagOpacity = interpolate(tagP, [0, 1], [0, 1]);
  const tagY = interpolate(tagP, [0, 1], [12, 0]);

  // Badge
  const badgeP = spring({
    frame: frame - 48,
    fps,
    config: { damping: 200 },
    durationInFrames: 24,
  });
  const badgeOpacity = interpolate(badgeP, [0, 1], [0, 1]);
  const badgeScale = interpolate(badgeP, [0, 1], [0.9, 1]);

  // Fade out
  const fadeOut = interpolate(frame, [60, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Background glowX={800} glowY={450} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo + Brand name row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 8,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 82,
              height: 82,
              borderRadius: 24,
              background: EXT.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 16px 48px rgba(76, 168, 122, 0.3), 0 4px 12px rgba(0,0,0,0.08)",
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
            }}
          >
            <span style={{ fontSize: 42, lineHeight: 1 }}>🌱</span>
          </div>

          {/* Brand name */}
          <div
            style={{
              opacity: nameOpacity,
              transform: `translateX(${nameX}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT.serif,
                fontSize: 88,
                fontWeight: 600,
                color: VID.text,
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              Assign
            </span>
            <span
              style={{
                fontFamily: FONT.serif,
                fontSize: 88,
                fontWeight: 600,
                color: EXT.primary,
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              mint.ai
            </span>
          </div>
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${VID.line}, transparent)`,
            marginBottom: 20,
          }}
        />

        {/* Tagline */}
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 22,
            fontWeight: 400,
            color: VID.textMuted,
            margin: "0 0 36px",
            letterSpacing: "0.2px",
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          Your assignments, finally organized.
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
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
          }}
        >
          <span style={{ fontSize: 13 }}>⚡</span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontSize: 13,
              fontWeight: 500,
              color: VID.textMuted,
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
