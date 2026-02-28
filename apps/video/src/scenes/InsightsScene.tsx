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

const CRITERIA = [
  { name: "Content & Argumentation", weight: "40 pts" },
  { name: "Research Quality", weight: "35 pts" },
  { name: "Structure & Organization", weight: "30 pts" },
  { name: "Evidence & Analysis", weight: "25 pts" },
  { name: "Citations & Formatting", weight: "20 pts" },
];

const MILESTONES = [
  { title: "Define research question and thesis", hours: "1.5h" },
  { title: "Conduct literature review", hours: "4h" },
  { title: "Create detailed outline", hours: "1h" },
  { title: "Write first draft", hours: "5h" },
  { title: "Revise and proofread", hours: "2h" },
];

function CriterionRow({
  name,
  weight,
  index,
  frame,
  fps,
}: {
  name: string;
  weight: string;
  index: number;
  frame: number;
  fps: number;
}) {
  const delay = 8 + index * 9;
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  return (
    <div
      style={{
        background: EXT.card,
        border: `1px solid ${EXT.border}`,
        borderRadius: 8,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [-12, 0])}px)`,
      }}
    >
      <span
        style={{
          flex: 1,
          fontSize: 11,
          fontWeight: 500,
          color: EXT.fg,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontSize: 9,
          padding: "2px 6px",
          borderRadius: 5,
          background: EXT.mutedBg,
          color: EXT.mutedFg,
          fontWeight: 600,
        }}
      >
        {weight}
      </span>
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke={EXT.mutedFg}
        strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

function MilestoneRow({
  title,
  hours,
  index,
  frame,
  fps,
  checked,
}: {
  title: string;
  hours: string;
  index: number;
  frame: number;
  fps: number;
  checked?: boolean;
}) {
  const delay = 60 + index * 9;
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  return (
    <div
      style={{
        background: EXT.card,
        border: `1px solid ${EXT.border}`,
        borderRadius: 8,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [12, 0])}px)`,
      }}
    >
      {checked ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={EXT.primary}
          strokeWidth="2.5"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ) : (
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            border: `1px solid ${EXT.border}`,
            background: EXT.mutedBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: EXT.mutedFg,
            }}
          >
            {index + 1}
          </span>
        </div>
      )}
      <span
        style={{
          flex: 1,
          fontSize: 11,
          fontWeight: 500,
          color: checked ? EXT.mutedFg : EXT.fg,
          textDecoration: checked ? "line-through" : "none",
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: 9,
          color: EXT.mutedFg,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <svg
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        ~{hours}
      </span>
    </div>
  );
}

const InsightsContent: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const rubricLabelP = spring({
    frame: frame - 4,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  const mileLabelP = spring({
    frame: frame - 55,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });

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
      <EXTHeader showBack backLabel="ECON 101" showSparkle />

      <div
        style={{
          flex: 1,
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: interpolate(headerP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(headerP, [0, 1], [8, 0])}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: EXT.fg,
              margin: "0 0 6px",
            }}
          >
            Final Paper: Supply and Demand Analysis
          </h2>
          <div style={{ display: "flex", gap: 5 }}>
            {["150 pts", "Due Mar 15"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 5,
                  background: EXT.mutedBg,
                  color: EXT.mutedFg,
                }}
              >
                {t}
              </span>
            ))}
            <span
              style={{
                fontSize: 9,
                padding: "2px 6px",
                borderRadius: 5,
                background: EXT.primaryTint,
                color: EXT.primary,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill={EXT.primary}
              >
                <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
              </svg>
              Analyzed
            </span>
          </div>
        </div>

        {/* Rubric */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              opacity: interpolate(rubricLabelP, [0, 1], [0, 1]),
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: EXT.mutedFg,
              }}
            >
              Rubric
            </span>
            <span style={{ fontSize: 9, color: EXT.mutedFg }}>
              150 pts total
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {CRITERIA.map((c, i) => (
              <CriterionRow
                key={c.name}
                name={c.name}
                weight={c.weight}
                index={i}
                frame={frame}
                fps={fps}
              />
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              opacity: interpolate(mileLabelP, [0, 1], [0, 1]),
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: EXT.mutedFg,
              }}
            >
              Milestones
            </span>
            <span style={{ fontSize: 9, color: EXT.mutedFg }}>
              0/5 complete
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {MILESTONES.map((m, i) => (
              <MilestoneRow
                key={m.title}
                title={m.title}
                hours={m.hours}
                index={i}
                frame={frame}
                fps={fps}
              />
            ))}
          </div>
        </div>
      </div>

      <EXTNav active="today" />
    </div>
  );
};

export const InsightsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  return (
    <AbsoluteFill>
      <Background glowX={600} glowY={480} />
      <ExtensionShell
        scale={1.22}
        opacity={interpolate(entryP, [0, 1], [0, 1])}
        position="left"
      >
        <InsightsContent frame={frame} fps={fps} />
      </ExtensionShell>
    </AbsoluteFill>
  );
};
