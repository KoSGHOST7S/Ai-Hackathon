import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { ExtensionShell } from "../components/ExtensionShell";
import { SceneCaption } from "../components/SceneCaption";
import { FONT } from "../fonts";
import { EXT } from "../colors";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  height: 38,
  borderRadius: 8,
  border: `1px solid ${EXT.border}`,
  background: EXT.bg,
  padding: "0 12px",
  fontSize: 13,
  color: EXT.fg,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const AccountContent: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const iconP = spring({ frame, fps, config: { damping: 12, stiffness: 160 }, durationInFrames: 30 });
  const titleP = spring({ frame: frame - 10, fps, config: { damping: 200 }, durationInFrames: 25 });
  const formP = spring({ frame: frame - 22, fps, config: { damping: 200 }, durationInFrames: 28 });
  const btnP = spring({ frame: frame - 50, fps, config: { damping: 200 }, durationInFrames: 22 });

  // Simulate email being "typed" (cursor blinking effect)
  const emailChars = "alex@university.edu";
  const emailProgress = interpolate(frame, [30, 70], [0, emailChars.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayEmail = emailChars.slice(0, Math.floor(emailProgress));

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
        padding: "0 24px",
        boxSizing: "border-box",
        fontFamily: FONT.sans,
      }}
    >
      {/* Progress dots */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 24,
          opacity: interpolate(iconP, [0, 1], [0, 1]),
        }}
      >
        <div style={{ width: 24, height: 6, borderRadius: 3, background: EXT.primary }} />
        <div style={{ width: 24, height: 6, borderRadius: 3, background: EXT.border }} />
      </div>

      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: EXT.primaryTint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          transform: `scale(${iconP})`,
          opacity: iconP,
        }}
      >
        <span style={{ fontSize: 28 }}>🌱</span>
      </div>

      {/* Title */}
      <h2
        style={{
          margin: "0 0 4px",
          fontSize: 19,
          fontWeight: 700,
          color: EXT.fg,
          opacity: interpolate(titleP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleP, [0, 1], [10, 0])}px)`,
        }}
      >
        Create your account
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 12,
          color: EXT.mutedFg,
          opacity: interpolate(titleP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleP, [0, 1], [10, 0])}px)`,
        }}
      >
        Step 1 of 2 — create your account
      </p>

      {/* Form */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: interpolate(formP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(formP, [0, 1], [12, 0])}px)`,
        }}
      >
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: EXT.fg, display: "block", marginBottom: 4 }}>
            Email
          </label>
          <div style={{ position: "relative" }}>
            <div style={{ ...INPUT_STYLE, display: "flex", alignItems: "center", lineHeight: 1 }}>
              {displayEmail}
              {frame > 30 && frame < 75 && (
                <span style={{ width: 1, height: 14, background: EXT.fg, display: "inline-block", marginLeft: 1, opacity: Math.sin(frame * 0.25) > 0 ? 1 : 0 }} />
              )}
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: EXT.fg, display: "block", marginBottom: 4 }}>
            Password
          </label>
          <div style={{ ...INPUT_STYLE, display: "flex", alignItems: "center", color: EXT.mutedFg, letterSpacing: "3px", fontSize: 16 }}>
            {frame > 50 ? "••••••••••" : ""}
          </div>
        </div>

        {/* Submit button */}
        <div
          style={{
            width: "100%",
            height: 40,
            borderRadius: 8,
            background: frame > 55 ? EXT.primary : `${EXT.primary}80`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
            opacity: interpolate(btnP, [0, 1], [0, 1]),
            boxShadow: frame > 55 ? "0 4px 12px rgba(76,168,122,0.3)" : "none",
            transition: "none",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Create Account</span>
        </div>
      </div>

      <p style={{ marginTop: 16, fontSize: 12, color: EXT.mutedFg, opacity: interpolate(btnP, [0, 1], [0, 1]) }}>
        Already have an account?{" "}
        <span style={{ color: EXT.primary, textDecoration: "underline" }}>Sign in</span>
      </p>
    </div>
  );
};

export const AccountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const opacity = interpolate(entryP, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={530} />
      <ExtensionShell scale={1.22} opacity={opacity}>
        <AccountContent frame={frame} fps={fps} />
      </ExtensionShell>
      <SceneCaption title="Quick sign-up" subtitle="Step 1 of 2 — create your free account" delay={15} />
    </AbsoluteFill>
  );
};
