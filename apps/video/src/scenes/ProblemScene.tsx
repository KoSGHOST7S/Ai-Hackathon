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

function AnimatedNumber({
  target,
  frame,
  fps,
  delay = 0,
}: {
  target: number;
  frame: number;
  fps: number;
  delay?: number;
}) {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 35,
  });
  const value = Math.round(interpolate(progress, [0, 1], [0, target]));
  return <>{value}</>;
}

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bigP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const s1P = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });
  const s2P = spring({
    frame: frame - 28,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });
  const tagP = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200 },
    durationInFrames: 28,
  });

  return (
    <AbsoluteFill>
      <Background glowX={600} glowY={500} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 160px",
        }}
      >
        {/* Left: Big number */}
        <div
          style={{
            flex: 1,
            opacity: interpolate(bigP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(bigP, [0, 1], [40, 0])}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT.sans,
              fontSize: 11,
              fontWeight: 600,
              color: EXT.primary,
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            The average student manages
          </p>
          <div
            style={{
              fontFamily: FONT.serif,
              fontSize: 180,
              fontWeight: 700,
              color: VID.text,
              lineHeight: 0.85,
              letterSpacing: "-8px",
            }}
          >
            <AnimatedNumber target={47} frame={frame} fps={fps} />
          </div>
          <p
            style={{
              fontFamily: FONT.sans,
              fontSize: 22,
              fontWeight: 400,
              color: VID.textMuted,
              margin: "12px 0 0",
              letterSpacing: "-0.3px",
            }}
          >
            active assignments
          </p>
        </div>

        {/* Right: Smaller stats */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 36,
            paddingLeft: 80,
          }}
        >
          <div
            style={{
              opacity: interpolate(s1P, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(s1P, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT.serif,
                fontSize: 72,
                fontWeight: 600,
                color: EXT.primary,
                lineHeight: 1,
                letterSpacing: "-3px",
              }}
            >
              <AnimatedNumber target={6} frame={frame} fps={fps} delay={15} />
            </div>
            <p
              style={{
                fontFamily: FONT.sans,
                fontSize: 16,
                color: VID.textMuted,
                margin: "4px 0 0",
              }}
            >
              due this week
            </p>
          </div>

          <div
            style={{
              opacity: interpolate(s2P, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(s2P, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT.serif,
                fontSize: 72,
                fontWeight: 600,
                color: EXT.primary,
                lineHeight: 1,
                letterSpacing: "-3px",
              }}
            >
              <AnimatedNumber target={4} frame={frame} fps={fps} delay={28} />
            </div>
            <p
              style={{
                fontFamily: FONT.sans,
                fontSize: 16,
                color: VID.textMuted,
                margin: "4px 0 0",
              }}
            >
              courses at once
            </p>
          </div>
        </div>
      </div>

      {/* Bottom statement */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(tagP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(tagP, [0, 1], [15, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 48, height: 1, background: VID.line }} />
          <p
            style={{
              fontFamily: FONT.serif,
              fontSize: 26,
              fontWeight: 500,
              fontStyle: "italic",
              color: VID.text,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            There&apos;s a smarter way.
          </p>
          <div style={{ width: 48, height: 1, background: VID.line }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
