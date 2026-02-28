import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { ExtensionShell } from "../components/ExtensionShell";
import { EXTHeader } from "../components/EXTHeader";
import { EXTNav } from "../components/EXTNav";
import { SceneCaption } from "../components/SceneCaption";
import { FONT } from "../fonts";
import { EXT } from "../colors";

const STEPS = [
  "Extracting explicit requirements…",
  "Generating rubric…",
  "Validating rubric…",
  "Building requirement-based milestones…",
  "Validating milestone coverage…",
];

// Each step starts completing at these frame offsets
const STEP_COMPLETE_AT = [30, 60, 90, 115, 140];

function StepRow({ label, index, frame, fps }: { label: string; index: number; frame: number; fps: number }) {
  const appearAt = index * 18;
  const completeAt = STEP_COMPLETE_AT[index];

  const rowP = spring({ frame: frame - appearAt, fps, config: { damping: 200 }, durationInFrames: 18 });
  const checkP = spring({ frame: frame - completeAt, fps, config: { damping: 10, stiffness: 200 }, durationInFrames: 18 });

  const isDone = frame > completeAt + 14;
  const isActive = frame >= appearAt && !isDone;
  const opacity = interpolate(rowP, [0, 1], [0, 1]);
  const checkScale = checkP;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: Math.max(opacity, isDone ? 1 : isActive ? 1 : 0.3),
        transform: `translateX(${interpolate(rowP, [0, 1], [-8, 0])}px)`,
      }}
    >
      {/* Icon */}
      <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isDone ? (
          <div style={{ transform: `scale(${checkScale})` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={EXT.primary} strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        ) : isActive ? (
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: `2px solid ${EXT.primary}`,
              borderTopColor: "transparent",
              animation: "none",
              transform: `rotate(${frame * 10}deg)`,
            }}
          />
        ) : (
          <div style={{ width: 14, height: 14, borderRadius: 3, background: EXT.mutedBg, border: `1px solid ${EXT.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: EXT.mutedFg }}>{index + 1}</span>
          </div>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: FONT.sans,
          fontSize: 12,
          fontWeight: isDone || isActive ? 500 : 400,
          color: isDone ? EXT.primary : isActive ? EXT.fg : EXT.mutedFg,
        }}
      >
        {label}
      </span>
    </div>
  );
}

const AILoadingContent: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spinnerP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const allDone = frame > STEP_COMPLETE_AT[4] + 20;

  return (
    <div style={{ width: 390, height: 600, background: EXT.bg, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: FONT.sans }}>
      <EXTHeader showBack backLabel="ECON 101" showSparkle />

      <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Assignment title */}
        <h2 style={{ fontSize: 12, fontWeight: 600, color: EXT.fg, margin: "0 0 14px", lineHeight: 1.35 }}>
          Final Paper: Supply and Demand Analysis
        </h2>

        {/* Central spinner / done check */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            opacity: interpolate(spinnerP, [0, 1], [0, 1]),
          }}
        >
          {allDone ? (
            <div style={{
              width: 56, height: 56,
              transform: `scale(${spring({ frame: frame - (STEP_COMPLETE_AT[4] + 20), fps, config: { damping: 10, stiffness: 200 }, durationInFrames: 22 })})`,
            }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={EXT.primary} strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          ) : (
            <div style={{
              width: 40, height: 40,
              borderRadius: "50%",
              border: `3px solid ${EXT.border}`,
              borderTopColor: EXT.primary,
              transform: `rotate(${frame * 8}deg)`,
            }} />
          )}
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STEPS.map((label, i) => (
            <StepRow key={label} label={label} index={i} frame={frame} fps={fps} />
          ))}
        </div>

        {allDone && (
          <div style={{
            marginTop: 20,
            padding: "10px 14px",
            borderRadius: 10,
            background: EXT.primaryTint,
            border: `1px solid rgba(76,168,122,0.25)`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: interpolate(spring({ frame: frame - (STEP_COMPLETE_AT[4] + 25), fps, config: { damping: 200 }, durationInFrames: 20 }), [0, 1], [0, 1]),
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={EXT.primary} stroke="none">
              <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500, color: EXT.primary }}>
              Analysis complete — rubric &amp; milestones ready
            </span>
          </div>
        )}
      </div>

      <EXTNav active="today" />
    </div>
  );
};

export const AILoadingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entryP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={530} />
      <ExtensionShell scale={1.22} opacity={interpolate(entryP, [0, 1], [0, 1])}>
        <AILoadingContent frame={frame} fps={fps} />
      </ExtensionShell>
      <SceneCaption
        title="Multi-agent AI pipeline at work"
        subtitle="Rubric generator → validator → milestone builder"
        delay={10}
      />
    </AbsoluteFill>
  );
};
