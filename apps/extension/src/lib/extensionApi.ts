type ExtensionApi = {
  action?: {
    setBadgeText?: (details: { text: string }) => unknown;
  };
  browserAction?: {
    setBadgeText?: (details: { text: string }) => unknown;
  };
  tabs?: {
    query?: (
      queryInfo: { active: boolean; currentWindow: boolean },
      callback?: (tabs: Array<{ url?: string }>) => void
    ) => unknown;
  };
  storage?: {
    local?: {
      get?: (keys: string | string[] | null, callback?: (items: Record<string, unknown>) => void) => unknown;
      set?: (items: Record<string, unknown>, callback?: () => void) => unknown;
      remove?: (keys: string | string[], callback?: () => void) => unknown;
    };
  };
};

function getGlobals() {
  return globalThis as typeof globalThis & {
    browser?: ExtensionApi;
    chrome?: ExtensionApi;
  };
}

export function getExtensionApi(): ExtensionApi | null {
  const globals = getGlobals();
  return globals.browser ?? globals.chrome ?? null;
}

export function getExtensionActionApi(api = getExtensionApi()) {
  if (!api) return null;
  return api.action ?? api.browserAction ?? null;
}

export function hasBrowserNamespace(): boolean {
  return typeof getGlobals().browser !== "undefined";
}

export function isPromiseLike<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}
