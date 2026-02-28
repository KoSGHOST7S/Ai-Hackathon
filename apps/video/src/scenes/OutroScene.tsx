import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { FONT } from "../fonts";
import { VID, EXT } from "../colors";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoP = spring({ frame, fps, config: { damping: 10, stiffness: 120 }, durationInFrames: 38 });
  const titleP = spring({ frame: frame - 16, fps, config: { damping: 200 }, durationInFrames: 28 });
  const tagP = spring({ frame: frame - 30, fps, config: { damping: 200 }, durationInFrames: 24 });
  const powP = spring({ frame: frame - 48, fps, config: { damping: 200 }, durationInFrames: 22 });
  const chromeP = spring({ frame: frame - 62, fps, config: { damping: 200 }, durationInFrames: 22 });
  const hackP = spring({ frame: frame - 76, fps, config: { damping: 200 }, durationInFrames: 20 });

  // Pulse the logo glow
  const glowPulse = 0.5 + Math.sin(frame * 0.08) * 0.2;

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={480} />

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}>
        {/* Logo with glow */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(76,168,122,${glowPulse * 0.35}) 0%, transparent 70%)`,
            filter: "blur(20px)",
          }} />
          <div style={{
            width: 92,
            height: 92,
            borderRadius: 26,
            background: EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 20px 60px rgba(76,168,122,${glowPulse * 0.45})`,
            transform: `scale(${logoP})`,
            opacity: logoP,
            position: "relative",
          }}>
            <span style={{ fontSize: 46 }}>🌱</span>
          </div>
        </div>

        {/* Brand */}
        <div style={{
          opacity: interpolate(titleP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleP, [0, 1], [18, 0])}px)`,
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: FONT.serif, fontSize: 68, fontWeight: 700, color: VID.white, letterSpacing: "-2px" }}>Assign</span>
          <span style={{ fontFamily: FONT.serif, fontSize: 68, fontWeight: 700, color: EXT.primary, letterSpacing: "-2px" }}>mint.ai</span>
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: FONT.sans,
          fontSize: 20,
          color: VID.textDim,
          margin: "0 0 36px",
          fontWeight: 400,
          opacity: interpolate(tagP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(tagP, [0, 1], [14, 0])}px)`,
        }}>
          AI-powered assignment analysis for Canvas LMS.
        </p>

        {/* Powered by badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderRadius: 100,
          border: "1px solid rgba(76,168,122,0.3)",
          background: "rgba(76,168,122,0.07)",
          marginBottom: 16,
          opacity: interpolate(powP, [0, 1], [0, 1]),
          transform: `scale(${interpolate(powP, [0, 1], [0.92, 1])})`,
        }}>
          <span style={{ fontSize: 15 }}>⚡</span>
          <span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, color: VID.textDim }}>
            Powered by IBM watsonx Granite
          </span>
        </div>

        {/* Chrome badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 100,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          marginBottom: 14,
          opacity: interpolate(chromeP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(chromeP, [0, 1], [10, 0])}px)`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={VID.textDimmer} stroke="none">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" fill={VID.bg} />
          </svg>
          <span style={{ fontFamily: FONT.sans, fontSize: 12, color: VID.textDim }}>
            Available as a Chrome Extension
          </span>
        </div>

        {/* Hackathon tag */}
        <div style={{
          opacity: interpolate(hackP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(hackP, [0, 1], [8, 0])}px)`,
        }}>
          <span style={{
            fontFamily: FONT.sans,
            fontSize: 11,
            color: VID.textDimmer,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Built for AI Hackathon 2025
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
