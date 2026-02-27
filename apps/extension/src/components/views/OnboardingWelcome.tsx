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
        className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg animate-scale-in"
        style={{ animationPlayState: play, animationDelay: "0ms" }}
      >
        <span className="text-4xl" role="img" aria-label="assignmint">🌱</span>
      </div>

      {/* Brand name */}
      <h1
        className="text-3xl font-bold tracking-tight text-foreground mb-2 animate-fade-in-up"
        style={{ animationPlayState: play, animationDelay: "80ms" }}
      >
        assignmint
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
