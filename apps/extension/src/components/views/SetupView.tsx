import { useState } from "react";
import { OnboardingWelcome } from "./OnboardingWelcome";
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

type StepIndex = 0 | 1 | 2;

export function SetupView({ onComplete, jwt, onStep1Complete, onSignup, onLogin }: Props) {
  // If JWT is already present (logged in but no Canvas config), skip to canvas step
  const [step, setStep] = useState<StepIndex>(jwt ? 2 : 0);
  const [accountMode, setAccountMode] = useState<"signup" | "login">("signup");

  const goToAccount = (mode: "signup" | "login") => {
    setAccountMode(mode);
    setStep(1);
  };

  const handleAccountComplete = () => {
    onStep1Complete();
    setStep(2);
  };

  return (
    <div className="h-full overflow-hidden">
      <div
        className="flex h-full"
        style={{
          width: "300%",
          transform: `translateX(-${(step / 3) * 100}%)`,
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="h-full" style={{ width: "33.333%" }}>
          <OnboardingWelcome
            isActive={step === 0}
            onGetStarted={() => goToAccount("signup")}
            onSignIn={() => goToAccount("login")}
          />
        </div>
        <div className="h-full" style={{ width: "33.333%" }}>
          <OnboardingStep1
            isActive={step === 1}
            initialMode={accountMode}
            onComplete={handleAccountComplete}
            onSignup={onSignup}
            onLogin={onLogin}
          />
        </div>
        <div className="h-full" style={{ width: "33.333%" }}>
          <OnboardingStep2
            isActive={step === 2}
            jwt={jwt ?? ""}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
}
