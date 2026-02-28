import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { FONT } from "../fonts";
import { VID, EXT } from "../colors";

function AnimatedNumber({ target, frame, fps, delay = 0 }: { target: number; frame: number; fps: number; delay?: number }) {
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 35 });
  const value = Math.round(interpolate(progress, [0, 1], [0, target]));
  return <>{value}</>;
}

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stat1 = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });
  const stat2 = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 25 });
  const stat3 = spring({ frame: frame - 36, fps, config: { damping: 200 }, durationInFrames: 25 });

  const lineIn = spring({ frame: frame - 55, fps, config: { damping: 200 }, durationInFrames: 28 });
  const lineOpacity = interpolate(lineIn, [0, 1], [0, 1]);
  const lineY = interpolate(lineIn, [0, 1], [20, 0]);

  return (
    <AbsoluteFill>
      <Background glowX={960} glowY={540} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
        }}
      >
        {/* Top label */}
        <p
          style={{
            fontFamily: FONT.sans,
            fontSize: 13,
            fontWeight: 600,
            color: EXT.primary,
            letterSpacing: "2px",
            textTransform: "uppercase",
            opacity: interpolate(stat1, [0, 1], [0, 1]),
            margin: 0,
          }}
        >
          The average student manages
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>
          {[
            { value: 47, label: "active assignments", delay: 0, prog: stat1 },
            { value: 6, label: "due this week", delay: 18, prog: stat2 },
            { value: 4, label: "courses at once", delay: 36, prog: stat3 },
          ].map(({ value, label, delay, prog }) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                opacity: interpolate(prog, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(prog, [0, 1], [30, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT.sans,
                  fontSize: 80,
                  fontWeight: 700,
                  color: EXT.primary,
                  lineHeight: 1,
                  letterSpacing: "-3px",
                }}
              >
                <AnimatedNumber target={value} frame={frame} fps={fps} delay={delay} />
              </div>
              <div
                style={{
                  fontFamily: FONT.sans,
                  fontSize: 16,
                  fontWeight: 400,
                  color: VID.textDim,
                  marginTop: 8,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div
          style={{
            opacity: lineOpacity,
            transform: `translateY(${lineY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 40, height: 1, background: `rgba(76,168,122,0.4)` }} />
          <p
            style={{
              fontFamily: FONT.sans,
              fontSize: 20,
              fontWeight: 500,
              color: VID.white,
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            There's a smarter way.
          </p>
          <div style={{ width: 40, height: 1, background: `rgba(76,168,122,0.4)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
