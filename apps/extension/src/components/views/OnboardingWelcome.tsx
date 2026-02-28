import { Button } from "@/components/ui/button";

interface Props {
  isActive: boolean;
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function OnboardingWelcome({ isActive, onGetStarted, onSignIn }: Props) {
  const play = isActive ? "running" : "paused";

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center select-none">
      {/* Logo mark */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg animate-scale-in p-3.5"
        style={{
          animationPlayState: play,
          animationDelay: "0ms",
          background: "linear-gradient(145deg, #5dbf8c 0%, #4CA87A 55%, #3d9468 100%)",
        }}
      >
        <img src="/mint-clean.svg" alt="assignmint" className="w-full h-full object-contain" />
      </div>

      {/* Brand name */}
      <h1
        className="text-3xl tracking-tight mb-2 animate-fade-in-up font-display"
        style={{ animationPlayState: play, animationDelay: "80ms" }}
      >
        <span className="text-foreground font-bold">Assign</span><span className="text-primary font-bold">mint.ai</span>
      </h1>

      {/* Tagline */}
      <p
        className="text-base text-muted-foreground mb-10 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "160ms" }}
      >
        Your assignments, organized.
      </p>

      {/* CTA */}
      <div
        className="w-full max-w-xs animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "240ms" }}
      >
        <Button className="w-full h-11 text-base font-semibold" onClick={onGetStarted}>
          Get Started
        </Button>
      </div>

      {/* Sign-in link */}
      <p
        className="mt-4 text-sm text-muted-foreground animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "320ms" }}
      >
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignIn}
          className="text-primary underline underline-offset-2 font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
