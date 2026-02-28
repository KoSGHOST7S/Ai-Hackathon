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

const DetailContent: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const bodyP = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const btnP = spring({
    frame: frame - 24,
    fps,
    config: { damping: 12, stiffness: 160 },
    durationInFrames: 24,
  });

  // Button pulses to draw attention
  const pulse = interpolate(frame, [30, 48, 66], [0.8, 1.0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button gets "pressed" before transitioning to AI scene
  const pressed = frame > 78;
  const btnScale = pressed
    ? interpolate(
        spring({
          frame: frame - 78,
          fps,
          config: { damping: 200 },
          durationInFrames: 10,
        }),
        [0, 1],
        [1, 0.95]
      )
    : interpolate(btnP, [0, 1], [0.9, 1]);

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
      <EXTHeader showBack backLabel="ECON 101" showSparkle={false} />

      <div
        style={{
          flex: 1,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            opacity: interpolate(headerP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(headerP, [0, 1], [8, 0])}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: EXT.fg,
              margin: "0 0 8px",
              lineHeight: 1.35,
            }}
          >
            Final Paper: Supply and Demand Analysis
          </h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["150 pts", "Due Mar 15", "online_upload"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  padding: "2px 7px",
                  borderRadius: 5,
                  background: EXT.mutedBg,
                  color: EXT.mutedFg,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: EXT.mutedBg,
            borderRadius: 10,
            padding: 12,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            opacity: interpolate(bodyP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(bodyP, [0, 1], [8, 0])}px)`,
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: EXT.mutedFg,
                margin: "0 0 4px",
              }}
            >
              Description
            </p>
            <p
              style={{
                fontSize: 11,
                color: `${EXT.fg}99`,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Write a 2,500-word analysis of supply and demand dynamics in a
              market of your choice. Include elasticity calculations,
              equilibrium analysis, and policy implications...
            </p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={EXT.mutedFg}
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Analyze button */}
        <div
          style={{
            width: "100%",
            height: 42,
            borderRadius: 10,
            background: EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            opacity: interpolate(btnP, [0, 1], [0, 1]) * pulse,
            transform: `scale(${btnScale})`,
            boxShadow: `0 6px 20px rgba(76,168,122,${0.2 + pulse * 0.15})`,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#fff"
            stroke="none"
          >
            <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            Analyze with AI
          </span>
        </div>
      </div>

      <EXTNav active="today" />
    </div>
  );
};

export const DetailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={480} />
      <ExtensionShell
        scale={1.22}
        opacity={interpolate(entryP, [0, 1], [0, 1])}
      >
        <DetailContent frame={frame} fps={fps} />
      </ExtensionShell>
    </AbsoluteFill>
  );
};
