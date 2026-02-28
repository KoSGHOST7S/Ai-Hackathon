export type SlideDirection = "forward" | "back";

export interface SlideTransitionLayers<TKey extends string> {
  baseKey: TKey;
  movingKey: TKey;
  movingClassName: "assignmint-slide-in-right" | "assignmint-slide-out-right";
}

export function getSlideTransitionLayers<TKey extends string>(
  fromKey: TKey,
  toKey: TKey,
  direction: SlideDirection
): SlideTransitionLayers<TKey> {
  if (direction === "forward") {
    return {
      baseKey: fromKey,
      movingKey: toKey,
      movingClassName: "assignmint-slide-in-right",
    };
  }

  return {
    baseKey: toKey,
    movingKey: fromKey,
    movingClassName: "assignmint-slide-out-right",
  };
}
