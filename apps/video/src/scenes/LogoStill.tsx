import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { EXT } from "../colors";

export const LogoStill: React.FC = () => {
  const { width } = useVideoConfig();
  // Padding so the mint illustration has breathing room
  const padding = Math.round(width * 0.14);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "22.5%",
          background: `linear-gradient(145deg, #5dbf8c 0%, ${EXT.primary} 55%, #3d9468 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)",
          padding,
          boxSizing: "border-box",
        }}
      >
        <Img
          src={staticFile("mint-clean.svg")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </AbsoluteFill>
  );
};
