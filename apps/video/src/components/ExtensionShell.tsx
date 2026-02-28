import React from "react";

interface Props {
  children: React.ReactNode;
  scale?: number;
  translateX?: number;
  translateY?: number;
  opacity?: number;
  tilt?: number;
  rotate?: number;
  position?: "center" | "left" | "right";
}

export const ExtensionShell: React.FC<Props> = ({
  children,
  scale = 1.25,
  translateX = 0,
  translateY = 0,
  opacity = 1,
  tilt = 0,
  rotate = 0,
  position = "center",
}) => {
  const posX =
    position === "left" ? "35%" : position === "right" ? "65%" : "50%";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: posX,
        width: 390,
        height: 600,
        transform: `translate(-50%, calc(-50% + ${translateY}px)) translateX(${translateX}px) perspective(1400px) rotateX(${tilt}deg) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center center",
        opacity,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
};
