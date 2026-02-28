import React from "react";

interface Props {
  children: React.ReactNode;
  scale?: number;
  translateY?: number;
  opacity?: number;
  tilt?: number; // degrees of 3D tilt (rotateX)
}

export const ExtensionShell: React.FC<Props> = ({
  children,
  scale = 1.25,
  translateY = 0,
  opacity = 1,
  tilt = 0,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 390,
        height: 600,
        transform: `translate(-50%, calc(-50% + ${translateY}px)) perspective(1400px) rotateX(${tilt}deg) scale(${scale})`,
        transformOrigin: "center center",
        opacity,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </div>
  );
};
