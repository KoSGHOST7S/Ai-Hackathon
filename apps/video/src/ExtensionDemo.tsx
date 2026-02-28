import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { IntroScene } from "./scenes/IntroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { WelcomeScene } from "./scenes/WelcomeScene";
import { AccountScene } from "./scenes/AccountScene";
import { CanvasScene } from "./scenes/CanvasScene";
import { TodayScene } from "./scenes/TodayScene";
import { DetailScene } from "./scenes/DetailScene";
import { AILoadingScene } from "./scenes/AILoadingScene";
import { ResultScene } from "./scenes/ResultScene";
import { ChatScene } from "./scenes/ChatScene";
import { ReviewScene } from "./scenes/ReviewScene";
import { OutroScene } from "./scenes/OutroScene";

const T = 20; // transition duration in frames

// Scene durations
export const SCENE_DURATIONS = {
  intro: 120,
  problem: 90,
  welcome: 150,
  account: 110,
  canvas: 100,
  today: 150,
  detail: 80,
  aiLoading: 180,
  result: 150,
  chat: 120,
  review: 120,
  outro: 130,
};

const durations = Object.values(SCENE_DURATIONS);
const numTransitions = durations.length - 1;
export const TOTAL_DURATION = durations.reduce((a, b) => a + b, 0) - numTransitions * T;
// = 1500 - 11*20 = 1500 - 220 = 1280

const fadeTiming = linearTiming({ durationInFrames: T });
const slideTiming = springTiming({ config: { damping: 200 }, durationInFrames: T });

export const ExtensionDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* 1. Brand Intro */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.intro}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        {/* 2. The Problem */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.problem}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        {/* 3. Extension Reveal + Welcome */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.welcome}>
          <WelcomeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />

        {/* 4. Account Setup */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.account}>
          <AccountScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />

        {/* 5. Canvas Connection */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.canvas}>
          <CanvasScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        {/* 6. Today Dashboard */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.today}>
          <TodayScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        {/* 7. Assignment Detail */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.detail}>
          <DetailScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        {/* 8. AI Loading */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.aiLoading}>
          <AILoadingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        {/* 9. Results: Rubric + Milestones */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.result}>
          <ResultScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />

        {/* 10. Chat */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.chat}>
          <ChatScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />

        {/* 11. Review Score */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.review}>
          <ReviewScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />

        {/* 12. Outro */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
