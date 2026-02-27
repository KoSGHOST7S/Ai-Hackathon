import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";
import type { SignupRequest, LoginRequest, AuthResponse } from "shared";

interface Props {
  onComplete: () => void;
  jwt: string | null;
  onStep1Complete: () => void;
  onSignup: (data: SignupRequest) => Promise<AuthResponse>;
  onLogin: (data: LoginRequest) => Promise<AuthResponse>;
}

export function SetupView({ onComplete, jwt, onStep1Complete, onSignup, onLogin }: Props) {
  if (!jwt) {
    return (
      <OnboardingStep1
        onComplete={onStep1Complete}
        onSignup={onSignup}
        onLogin={onLogin}
      />
    );
  }
  return <OnboardingStep2 jwt={jwt} onComplete={onComplete} />;
}
