import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getSlideTransitionLayers,
  type SlideDirection,
} from "@/lib/slideTransitionLogic";

interface SlideTransitionProps<TKey extends string> {
  activeKey: TKey;
  direction: SlideDirection;
  renderScene: (key: TKey) => React.ReactNode;
  durationMs?: number;
  className?: string;
}

export function SlideTransition<TKey extends string>({
  activeKey,
  direction,
  renderScene,
  durationMs = 220,
  className,
}: SlideTransitionProps<TKey>) {
  const [displayedKey, setDisplayedKey] = useState<TKey>(activeKey);
  const [transition, setTransition] = useState<{
    fromKey: TKey;
    toKey: TKey;
    direction: SlideDirection;
  } | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);

    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (activeKey === displayedKey) return;

    if (reduceMotion) {
      setTransition(null);
      setDisplayedKey(activeKey);
      return;
    }

    setTransition({ fromKey: displayedKey, toKey: activeKey, direction });
    setDisplayedKey(activeKey);
  }, [activeKey, displayedKey, direction, reduceMotion]);

  useEffect(() => {
    if (!transition) return;
    const timer = window.setTimeout(() => setTransition(null), durationMs);
    return () => window.clearTimeout(timer);
  }, [transition, durationMs]);

  const layers = useMemo(() => {
    if (!transition) return null;
    return getSlideTransitionLayers(
      transition.fromKey,
      transition.toKey,
      transition.direction
    );
  }, [transition]);

  if (!transition || !layers) {
    return <div className={cn("relative h-full", className)}>{renderScene(displayedKey)}</div>;
  }

  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <div className="absolute inset-0">{renderScene(layers.baseKey)}</div>
      <div className={cn("absolute inset-0 pointer-events-none", layers.movingClassName)}>
        {renderScene(layers.movingKey)}
      </div>
    </div>
  );
}
