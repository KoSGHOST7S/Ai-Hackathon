// Unified storage abstraction: extension storage in browser context,
// localStorage as fallback for local dev/testing.

import { getExtensionApi, hasBrowserNamespace, isPromiseLike } from "@/lib/extensionApi";

async function extensionStorageGet(
  key: string | string[] | null
): Promise<Record<string, unknown>> {
  const extensionApi = getExtensionApi();
  const storageLocal = extensionApi?.storage?.local;
  if (!storageLocal?.get) {
    return {};
  }

  if (hasBrowserNamespace()) {
    const result = storageLocal.get(key);
    if (isPromiseLike<Record<string, unknown>>(result)) {
      try {
        return (await result) ?? {};
      } catch {
        return {};
      }
    }
  }

  return new Promise((resolve) => {
    try {
      storageLocal.get?.(key, (items) => resolve(items ?? {}));
    } catch {
      resolve({});
    }
  });
}

async function extensionStorageSet(items: Record<string, unknown>): Promise<void> {
  const extensionApi = getExtensionApi();
  const storageLocal = extensionApi?.storage?.local;
  if (!storageLocal?.set) return;

  if (hasBrowserNamespace()) {
    const result = storageLocal.set(items);
    if (isPromiseLike<void>(result)) {
      try {
        await result;
      } catch {
        // Ignore storage errors to keep popup resilient.
      }
      return;
    }
  }

  await new Promise<void>((resolve) => {
    try {
      storageLocal.set?.(items, () => resolve());
    } catch {
      resolve();
    }
  });
}

async function extensionStorageRemove(keys: string | string[]): Promise<void> {
  const extensionApi = getExtensionApi();
  const storageLocal = extensionApi?.storage?.local;
  if (!storageLocal?.remove) return;

  if (hasBrowserNamespace()) {
    const result = storageLocal.remove(keys);
    if (isPromiseLike<void>(result)) {
      try {
        await result;
      } catch {
        // Ignore storage errors to keep popup resilient.
      }
      return;
    }
  }

  await new Promise<void>((resolve) => {
    try {
      storageLocal.remove?.(keys, () => resolve());
    } catch {
      resolve();
    }
  });
}

export function storageGet(key: string): Promise<string | null> {
  if (getExtensionApi()?.storage?.local) {
    return extensionStorageGet(key).then(
      (result) => (result[key] as string | undefined) ?? null
    );
  }
  return Promise.resolve(localStorage.getItem(key));
}

export function storageGetRaw(key: string): Promise<unknown | null> {
  if (getExtensionApi()?.storage?.local) {
    return extensionStorageGet(key).then((result) => result[key] ?? null);
  }
  const raw = localStorage.getItem(key);
  if (raw === null) return Promise.resolve(null);
  try {
    return Promise.resolve(JSON.parse(raw));
  } catch {
    return Promise.resolve(raw);
  }
}

export function storageSet(key: string, value: string): Promise<void> {
  if (getExtensionApi()?.storage?.local) {
    return extensionStorageSet({ [key]: value });
  }
  localStorage.setItem(key, value);
  return Promise.resolve();
}

export function storageSetRaw(key: string, value: unknown): Promise<void> {
  if (getExtensionApi()?.storage?.local) {
    return extensionStorageSet({ [key]: value });
  }
  const encoded = typeof value === "string" ? value : JSON.stringify(value);
  localStorage.setItem(key, encoded);
  return Promise.resolve();
}

export function storageRemove(key: string): Promise<void> {
  if (getExtensionApi()?.storage?.local) {
    return extensionStorageRemove(key);
  }
  localStorage.removeItem(key);
  return Promise.resolve();
}

export function storageListKeys(): Promise<string[]> {
  if (getExtensionApi()?.storage?.local) {
    return extensionStorageGet(null).then((items) => Object.keys(items));
  }
  return Promise.resolve(Object.keys(localStorage));
}
