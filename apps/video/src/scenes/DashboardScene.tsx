import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { ExtensionShell } from "../components/ExtensionShell";
import { EXTHeader } from "../components/EXTHeader";
import { EXTNav } from "../components/EXTNav";
import { FONT } from "../fonts";
import { EXT } from "../colors";

const ASSIGNMENTS = [
  {
    name: "Final Paper: Supply and Demand Analysis",
    course: "ECON 101",
    pts: 150,
    dueLabel: "2d left",
    variant: "warn" as const,
  },
  {
    name: "Problem Set 6: Linear Algebra",
    course: "MATH 215",
    pts: 50,
    dueLabel: "5d left",
    variant: "muted" as const,
  },
  {
    name: "Lab Report: Acid-Base Titration",
    course: "CHEM 301",
    pts: 25,
    dueLabel: "Due today",
    variant: "urgent" as const,
  },
  {
    name: "Essay: Symbolism in Hamlet",
    course: "ENG 240",
    pts: 100,
    dueLabel: "8d left",
    variant: "muted" as const,
  },
];

const BADGE_COLORS = {
  urgent: { bg: "rgba(220,38,38,0.12)", text: "#DC2626" },
  warn: { bg: "rgba(234,179,8,0.12)", text: "#CA8A04" },
  muted: { bg: EXT.mutedBg, text: EXT.mutedFg },
};

function AssignmentCard({
  assignment,
  index,
  frame,
  fps,
  tapped,
}: {
  assignment: (typeof ASSIGNMENTS)[0];
  index: number;
  frame: number;
  fps: number;
  tapped: boolean;
}) {
  const delay = 30 + index * 8;
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const badge = BADGE_COLORS[assignment.variant];

  // Tap highlight on first card
  const tapScale = tapped ? 0.97 : 1;
  const tapBg = tapped ? EXT.primaryTint : EXT.card;

  return (
    <div
      style={{
        background: tapBg,
        border: `1px solid ${tapped ? EXT.primary : EXT.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px) scale(${tapScale})`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 12,
            fontWeight: 500,
            color: EXT.fg,
            margin: 0,
            flex: 1,
            lineHeight: 1.3,
          }}
        >
          {assignment.name}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          {index < 2 && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: EXT.primaryTint,
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 9,
                fontWeight: 700,
                color: EXT.primary,
                letterSpacing: "0.4px",
                textTransform: "uppercase",
              }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill={EXT.primary}
                stroke="none"
              >
                <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
              </svg>
              AI
            </span>
          )}
          <span
            style={{
              padding: "2px 7px",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 500,
              background: badge.bg,
              color: badge.text,
            }}
          >
            {assignment.dueLabel}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke={EXT.mutedFg}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span
          style={{ fontFamily: FONT.sans, fontSize: 11, color: EXT.mutedFg }}
        >
          {assignment.course} · {assignment.pts} pts
        </span>
      </div>
    </div>
  );
}

const DashContent: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const greetP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const statsP = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  // First card gets "tapped" near end of scene
  const firstCardTapped = frame > 72;

  return (
    <div
      style={{
        width: 390,
        height: 600,
        background: EXT.bg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: FONT.sans,
      }}
    >
      <EXTHeader tab="Today" />

      <div
        style={{
          flex: 1,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            opacity: interpolate(greetP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(greetP, [0, 1], [8, 0])}px)`,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: EXT.fg,
              margin: 0,
            }}
          >
            Good morning, Alex
          </p>
          <p style={{ fontSize: 11, color: EXT.mutedFg, margin: "2px 0 0" }}>
            3 assignments due today
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            opacity: interpolate(statsP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(statsP, [0, 1], [8, 0])}px)`,
            flexShrink: 0,
          }}
        >
          {[
            { label: "Due today", value: 3 },
            { label: "Upcoming", value: 8 },
            { label: "All", value: 24 },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: EXT.primaryTint,
                borderRadius: 8,
                padding: "8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: EXT.primary,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: EXT.mutedFg,
                  margin: "3px 0 0",
                  lineHeight: 1,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {ASSIGNMENTS.map((a, i) => (
            <AssignmentCard
              key={a.name}
              assignment={a}
              index={i}
              frame={frame}
              fps={fps}
              tapped={i === 0 && firstCardTapped}
            />
          ))}
        </div>
      </div>

      <EXTNav active="today" />
    </div>
  );
};

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 28,
  });

  return (
    <AbsoluteFill>
      <Background glowX={700} glowY={450} />
      <ExtensionShell
        scale={1.22}
        opacity={interpolate(entryP, [0, 1], [0, 1])}
        position="left"
      >
        <DashContent frame={frame} fps={fps} />
      </ExtensionShell>
    </AbsoluteFill>
  );
};
