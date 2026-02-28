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
import { EXTNav } from "../components/EXTNav";
import { FONT } from "../fonts";
import { EXT } from "../colors";

const AI_RESPONSE =
  "Based on the rubric, Content & Argumentation carries the most weight at 40 points. Focus on a clear, defensible thesis and support it with economic theory throughout. Your supply/demand analysis needs to include equilibrium shifts with evidence.";

const ChatContent: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const userMsgP = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const aiMsgP = spring({
    frame: frame - 32,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  const charCount = interpolate(frame, [38, 100], [0, AI_RESPONSE.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayText = AI_RESPONSE.slice(0, Math.floor(charCount));
  const showCursor = frame > 38 && frame < 102;

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
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${EXT.border}`,
          background: EXT.card,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: interpolate(headerP, [0, 1], [0, 1]),
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: EXT.mutedFg,
            display: "flex",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: EXT.fg,
              margin: 0,
            }}
          >
            Final Paper: Supply and Demand
          </p>
          <p
            style={{ fontSize: 9, color: EXT.mutedFg, margin: 0 }}
          >
            AI Assignment Assistant
          </p>
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: EXT.primaryTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={EXT.primary}
            stroke="none"
          >
            <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
          </svg>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflow: "hidden",
        }}
      >
        {/* User message */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            opacity: interpolate(userMsgP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(userMsgP, [0, 1], [12, 0])}px)`,
          }}
        >
          <div
            style={{
              maxWidth: "78%",
              background: EXT.primary,
              borderRadius: "12px 12px 2px 12px",
              padding: "9px 12px",
              boxShadow: "0 2px 8px rgba(76,168,122,0.2)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#fff",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              What should I focus on most for this paper to get the best
              grade?
            </p>
          </div>
        </div>

        {/* AI response */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            opacity: interpolate(aiMsgP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(aiMsgP, [0, 1], [12, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: EXT.primaryTint,
              border: `1px solid ${EXT.primaryTint20}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={EXT.primary}
              stroke="none"
            >
              <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
            </svg>
          </div>
          <div
            style={{
              flex: 1,
              background: EXT.card,
              border: `1px solid ${EXT.border}`,
              borderRadius: "12px 12px 12px 2px",
              padding: "9px 12px",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: EXT.fg,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {displayText}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 1.5,
                    height: 13,
                    background: EXT.primary,
                    marginLeft: 1,
                    opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                  }}
                />
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div
        style={{
          borderTop: `1px solid ${EXT.border}`,
          background: EXT.card,
          padding: "10px 12px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${EXT.border}`,
            background: EXT.bg,
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: EXT.mutedFg }}>
            Ask a follow-up…
          </span>
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: EXT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const ChatScene: React.FC = () => {
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
      <Background glowX={1200} glowY={500} />
      <ExtensionShell
        scale={1.22}
        opacity={interpolate(entryP, [0, 1], [0, 1])}
        position="right"
      >
        <ChatContent frame={frame} fps={fps} />
      </ExtensionShell>
    </AbsoluteFill>
  );
};
