import React from "react";
import { Composition, Still } from "remotion";
import { ExtensionDemo, TOTAL_DURATION } from "./ExtensionDemo";
import { LogoStill } from "./scenes/LogoStill";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ExtensionDemo"
        component={ExtensionDemo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Logo icon renders at standard sizes */}
      <Still id="Logo-512" component={LogoStill} width={512} height={512} />
      <Still id="Logo-192" component={LogoStill} width={192} height={192} />
      <Still id="Logo-180" component={LogoStill} width={180} height={180} />
      <Still id="Logo-32"  component={LogoStill} width={32}  height={32}  />
      <Still id="Logo-16"  component={LogoStill} width={16}  height={16}  />
    </>
  );
};
