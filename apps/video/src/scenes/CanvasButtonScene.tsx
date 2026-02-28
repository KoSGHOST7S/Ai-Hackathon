import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Background } from "../components/Background";
import { FONT } from "../fonts";
import { EXT } from "../colors";

export const CanvasButtonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser entrance
  const browserP = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const browserOpacity = interpolate(browserP, [0, 1], [0, 1]);
  const browserScale = interpolate(browserP, [0, 1], [0.94, 1]);

  // Cursor movement to button
  const cursorP = interpolate(frame, [20, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorX = interpolate(cursorP, [0, 1], [580, 920]);
  const cursorY = interpolate(cursorP, [0, 1], [380, 395]);
  const cursorVisible = frame > 18 && frame < 70;

  // Button press effect
  const pressed = frame >= 45 && frame <= 50;
  const btnScale = pressed ? 0.96 : 1;

  // Button glow after hover
  const hoverGlow = interpolate(frame, [36, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Extension popup after click
  const extP = spring({
    frame: frame - 54,
    fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 35,
  });
  const extScale = interpolate(extP, [0, 1], [0.3, 0.72]);
  const extOpacity = interpolate(extP, [0, 1], [0, 1]);
  const extY = interpolate(extP, [0, 1], [40, 0]);

  return (
    <AbsoluteFill>
      <Background glowX={650} glowY={400} />

      {/* Browser window mock */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "42%",
          transform: `translate(-50%, -50%) scale(${browserScale})`,
          width: 880,
          height: 520,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
          opacity: browserOpacity,
          background: "#FFFFFF",
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            height: 38,
            background: "#F3F3F3",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <div style={{ display: "flex", gap: 6, marginRight: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FF5F57",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FFBD2E",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#28C840",
              }}
            />
          </div>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "8px 8px 0 0",
              padding: "5px 14px",
              fontSize: 11,
              fontFamily: FONT.sans,
              color: "#333",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: "#E74C3C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}
              >
                C
              </span>
            </div>
            Canvas LMS — ECON 101
          </div>
        </div>

        {/* URL bar */}
        <div
          style={{
            height: 34,
            background: "#FAFAFA",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            borderBottom: "1px solid #EAEAEA",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 24,
              borderRadius: 6,
              background: "#F0F0F0",
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              fontSize: 11,
              fontFamily: FONT.sans,
              color: "#999",
            }}
          >
            🔒 bw.instructure.com/courses/12345/assignments/67890
          </div>
        </div>

        {/* Canvas content */}
        <div style={{ padding: "20px 28px", fontFamily: FONT.sans }}>
          <div
            style={{
              fontSize: 11,
              color: "#2D72D9",
              marginBottom: 14,
              display: "flex",
              gap: 6,
            }}
          >
            <span>ECON 101</span>
            <span style={{ color: "#CCC" }}>›</span>
            <span>Assignments</span>
            <span style={{ color: "#CCC" }}>›</span>
            <span style={{ color: "#666" }}>Final Paper</span>
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: "#2D3B45",
              margin: "0 0 6px",
              fontFamily: FONT.sans,
            }}
          >
            Final Paper: Supply and Demand Analysis
          </h1>

          <div
            style={{
              height: 1,
              background: "#E0E0E0",
              margin: "14px 0",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 12,
              color: "#666",
              marginBottom: 14,
            }}
          >
            <div>
              <strong style={{ color: "#2D3B45" }}>Due:</strong> Mar 15,
              2026
            </div>
            <div>
              <strong style={{ color: "#2D3B45" }}>Points:</strong> 150
            </div>
            <div>
              <strong style={{ color: "#2D3B45" }}>Submitting:</strong> a
              file upload
            </div>
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#555",
              lineHeight: 1.6,
              maxWidth: 540,
            }}
          >
            <p style={{ margin: "0 0 10px" }}>
              Write a 2,500-word analysis of supply and demand dynamics in
              a market of your choice.
            </p>
          </div>

          {/* The Assignmint button */}
          <div
            style={{
              position: "absolute",
              top: 142,
              right: 28,
              transform: `scale(${btnScale})`,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                background: EXT.primary,
                boxShadow: `0 4px 14px rgba(76,168,122,${0.25 + hoverGlow * 0.2})`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"
                  fill="#fff"
                />
                <path
                  d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
                  stroke="#fff"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: FONT.sans,
                }}
              >
                Open in Assignmint
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cursor */}
      {cursorVisible && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            zIndex: 100,
            pointerEvents: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
          }}
        >
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="#000"
            stroke="#fff"
            strokeWidth="1"
          >
            <path d="M3 1L3 17L7 13L12 19L14 17L9 11L15 11L3 1Z" />
          </svg>
        </div>
      )}

      {/* Extension popup after click */}
      {frame > 52 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 100,
            transform: `translateY(calc(-50% + ${extY}px)) scale(${extScale})`,
            transformOrigin: "top right",
            width: 390,
            height: 600,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
            opacity: extOpacity,
            background: EXT.bg,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              boxSizing: "border-box",
              fontFamily: FONT.sans,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: EXT.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 10px 28px rgba(76,168,122,0.3)",
              }}
            >
              <span style={{ fontSize: 28 }}>🌱</span>
            </div>
            <div
              style={{
                fontFamily: FONT.serif,
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <span style={{ color: EXT.fg }}>Assign</span>
              <span style={{ color: EXT.primary }}>mint.ai</span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: EXT.mutedFg,
                margin: "0 0 20px",
                textAlign: "center",
              }}
            >
              Analyzing your assignment...
            </p>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `3px solid ${EXT.border}`,
                borderTopColor: EXT.primary,
                transform: `rotate(${frame * 10}deg)`,
              }}
            />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
