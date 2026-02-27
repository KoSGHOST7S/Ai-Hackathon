import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";

interface Props {
  onComplete: () => void;
  jwt: string | null;
  onStep1Complete: () => void;
}

export function SetupView({ onComplete, jwt, onStep1Complete }: Props) {
  if (!jwt) {
    return <OnboardingStep1 onComplete={onStep1Complete} />;
  }
  return <OnboardingStep2 jwt={jwt} onComplete={onComplete} />;
}
