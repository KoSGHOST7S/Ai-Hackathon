import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { IntroScene } from "./scenes/IntroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { CanvasButtonScene } from "./scenes/CanvasButtonScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { DetailScene } from "./scenes/DetailScene";
import { AIProcessingScene } from "./scenes/AIProcessingScene";
import { InsightsScene } from "./scenes/InsightsScene";
import { ChatScene } from "./scenes/ChatScene";
import { ScoreScene } from "./scenes/ScoreScene";
import { OutroScene } from "./scenes/OutroScene";

const T = 15;

export const SCENE_DURATIONS = {
  intro: 80,
  problem: 70,
  canvasButton: 85,
  dashboard: 90,
  detail: 90,
  aiProcessing: 120,
  insights: 110,
  chat: 95,
  score: 95,
  outro: 80,
};

const durations = Object.values(SCENE_DURATIONS);
const numTransitions = durations.length - 1;
export const TOTAL_DURATION =
  durations.reduce((a, b) => a + b, 0) - numTransitions * T;

const fadeTiming = linearTiming({ durationInFrames: T });
const slideTiming = springTiming({
  config: { damping: 200 },
  durationInFrames: T,
});

export const ExtensionDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* 1. Brand */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.intro}
        >
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* 2. The problem — overwhelmed students */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.problem}
        >
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* 3. One click on Canvas — the entry point */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.canvasButton}
        >
          <CanvasButtonScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={slideTiming}
        />

        {/* 4. Your dashboard — all assignments synced */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.dashboard}
        >
          <DashboardScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={slideTiming}
        />

        {/* 5. Tap an assignment — see details & analyze */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.detail}
        >
          <DetailScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* 6. AI pipeline at work */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.aiProcessing}
        >
          <AIProcessingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* 7. Results — rubric & milestones */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.insights}
        >
          <InsightsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={slideTiming}
        />

        {/* 8. Ask AI anything about your assignment */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.chat}
        >
          <ChatScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={slideTiming}
        />

        {/* 9. Pre-submission score */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.score}
        >
          <ScoreScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* 10. Get started */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.outro}
        >
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
