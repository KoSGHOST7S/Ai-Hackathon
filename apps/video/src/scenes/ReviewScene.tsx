import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { ExtensionShell } from "../components/ExtensionShell";
import { EXTNav } from "../components/EXTNav";
import { SceneCaption } from "../components/SceneCaption";
import { FONT } from "../fonts";
import { EXT } from "../colors";

const SCORES = [
  { name: "Content & Argumentation", score: 36, max: 40 },
  { name: "Research Quality", score: 31, max: 35 },
  { name: "Structure & Organization", score: 26, max: 30 },
  { name: "Evidence & Analysis", score: 21, max: 25 },
  { name: "Citations & Formatting", score: 14, max: 20 },
];

const TOTAL = SCORES.reduce((a, b) => a + b.score, 0);
const MAX = SCORES.reduce((a, b) => a + b.max, 0);

function ScoreBar({ score, max, frame, fps, delay }: { score: number; max: number; frame: number; fps: number; delay: number }) {
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 28 });
  const pct = (score / max) * 100;
  const color = pct >= 90 ? "#10B981" : pct >= 75 ? EXT.primary : pct >= 60 ? "#F59E0B" : EXT.secondary;

  return (
    <div style={{ height: 5, borderRadius: 3, background: EXT.mutedBg, overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${interpolate(p, [0, 1], [0, pct])}%`,
        borderRadius: 3,
        background: color,
      }} />
    </div>
  );
}

const ReviewContent: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const headerP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const scoreP = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 120 }, durationInFrames: 35 });
  const scoreNum = Math.round(interpolate(scoreP, [0, 1], [0, TOTAL]));
  const pctP = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 25 });

  return (
    <div style={{ width: 390, height: 600, background: EXT.bg, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: FONT.sans }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: `1px solid ${EXT.border}`,
        background: EXT.card,
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
        opacity: interpolate(headerP, [0, 1], [0, 1]),
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={EXT.mutedFg} strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        <span style={{ fontFamily: FONT.serif, fontSize: 14, fontWeight: 700 }}>
          <span style={{ color: EXT.fg }}>Assign</span><span style={{ color: EXT.primary }}>mint.ai</span>
        </span>
        <span style={{ color: EXT.border }}>·</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: EXT.fg }}>AI Review</span>
      </div>

      <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
        {/* Big score */}
        <div style={{
          background: EXT.card,
          border: `1px solid ${EXT.border}`,
          borderRadius: 12,
          padding: "18px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: interpolate(scoreP, [0, 1], [0, 1]),
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: EXT.mutedFg, margin: 0 }}>
            Pre-Submission Score
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 52, fontWeight: 700, color: EXT.primary, lineHeight: 1, letterSpacing: "-2px" }}>
              {scoreNum}
            </span>
            <span style={{ fontSize: 20, color: EXT.mutedFg, fontWeight: 500 }}>/{MAX}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 12, color: EXT.mutedFg }}>
              {Math.round(interpolate(pctP, [0, 1], [0, Math.round((TOTAL / MAX) * 100)]))}% — Strong pass
            </span>
          </div>
        </div>

        {/* Per-criterion breakdown */}
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: EXT.mutedFg, marginBottom: 8 }}>
            Breakdown
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {SCORES.map((s, i) => {
              const delay = 30 + i * 10;
              const rowP = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 20 });
              return (
                <div key={s.name} style={{ opacity: interpolate(rowP, [0, 1], [0, 1]), transform: `translateX(${interpolate(rowP, [0, 1], [-10, 0])}px)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: EXT.fg }}>{s.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: EXT.primary }}>{s.score}/{s.max}</span>
                  </div>
                  <ScoreBar score={s.score} max={s.max} frame={frame} fps={fps} delay={delay + 5} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Key feedback */}
        <div style={{ background: EXT.primaryTint, border: `1px solid rgba(76,168,122,0.2)`, borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: EXT.primary, margin: "0 0 6px" }}>
            Top improvement
          </p>
          <p style={{ fontSize: 11, color: EXT.fg, margin: 0, lineHeight: 1.4 }}>
            Citations could be more consistent. Switch to one citation style throughout and ensure all in-text citations match your bibliography.
          </p>
        </div>
      </div>

      <EXTNav active="today" />
    </div>
  );
};

export const ReviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entryP = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={530} />
      <ExtensionShell scale={1.22} opacity={interpolate(entryP, [0, 1], [0, 1])}>
        <ReviewContent frame={frame} fps={fps} />
      </ExtensionShell>
      <SceneCaption title="Know your grade before you submit" subtitle="AI scores your work against the rubric" delay={20} />
    </AbsoluteFill>
  );
};
