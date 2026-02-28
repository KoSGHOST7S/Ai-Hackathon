import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { ExtensionShell } from "../components/ExtensionShell";
import { SceneCaption } from "../components/SceneCaption";
import { FONT } from "../fonts";
import { EXT } from "../colors";

const CanvasContent: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const iconP = spring({ frame, fps, config: { damping: 12 }, durationInFrames: 28 });
  const formP = spring({ frame: frame - 14, fps, config: { damping: 200 }, durationInFrames: 26 });
  const btnP = spring({ frame: frame - 44, fps, config: { damping: 200 }, durationInFrames: 22 });

  // "Typing" the Canvas URL
  const url = "bw.instructure.com";
  const urlProgress = interpolate(frame, [20, 60], [0, url.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayUrl = url.slice(0, Math.floor(urlProgress));

  // Connected badge animation
  const connectedP = spring({ frame: frame - 72, fps, config: { damping: 14, stiffness: 180 }, durationInFrames: 22 });
  const showConnected = frame > 72;

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
      {/* Progress dots: both active */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, opacity: interpolate(iconP, [0, 1], [0, 1]) }}>
        <div style={{ width: 24, height: 6, borderRadius: 3, background: EXT.primary }} />
        <div style={{ width: 24, height: 6, borderRadius: 3, background: EXT.primary }} />
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
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={EXT.primary} strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>

      <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 700, color: EXT.fg, opacity: interpolate(formP, [0, 1], [0, 1]) }}>
        Connect Canvas
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 12, color: EXT.mutedFg, opacity: interpolate(formP, [0, 1], [0, 1]) }}>
        Step 2 of 2 — connect your school's Canvas
      </p>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: interpolate(formP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(formP, [0, 1], [10, 0])}px)`,
        }}
      >
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: EXT.fg, display: "block", marginBottom: 4 }}>
            Canvas URL
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 38,
              border: `1px solid ${showConnected ? EXT.primary : EXT.border}`,
              borderRadius: 8,
              background: EXT.card,
              padding: "0 10px",
              fontSize: 13,
              color: EXT.fg,
              gap: 4,
              transition: "none",
            }}
          >
            <span style={{ color: EXT.mutedFg, fontSize: 12 }}>https://</span>
            <span>{displayUrl}</span>
            {frame > 20 && frame < 62 && (
              <span style={{ width: 1, height: 14, background: EXT.fg, opacity: Math.sin(frame * 0.28) > 0 ? 1 : 0 }} />
            )}
          </div>
        </div>

        {/* Connected badge */}
        {showConnected && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.25)",
              transform: `scale(${connectedP})`,
              opacity: connectedP,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#10B981" }}>
              Canvas connected — assignments synced
            </span>
          </div>
        )}

        <div
          style={{
            width: "100%",
            height: 40,
            borderRadius: 8,
            background: showConnected ? "#10B981" : EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
            opacity: interpolate(btnP, [0, 1], [0, 1]),
            boxShadow: "0 4px 12px rgba(76,168,122,0.3)",
            gap: 6,
          }}
        >
          {showConnected ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>All set! Opening dashboard…</span>
            </>
          ) : (
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Connect Canvas</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CanvasScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 28 });

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={530} />
      <ExtensionShell scale={1.22} opacity={interpolate(entryP, [0, 1], [0, 1])}>
        <CanvasContent frame={frame} fps={fps} />
      </ExtensionShell>
      <SceneCaption title="Connect your Canvas LMS" subtitle="Works with any Canvas-powered university" delay={20} />
    </AbsoluteFill>
  );
};
