// Unified storage abstraction: chrome.storage.local in extension context,
// localStorage as fallback for local dev/testing.

export function storageGet(key: string): Promise<string | null> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => resolve((result[key] as string | undefined) ?? null));
    });
  }
  return Promise.resolve(localStorage.getItem(key));
}

export function storageGetRaw(key: string): Promise<unknown | null> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => resolve(result[key] ?? null));
    });
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
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  localStorage.setItem(key, value);
  return Promise.resolve();
}

export function storageRemove(key: string): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, resolve);
    });
  }
  localStorage.removeItem(key);
  return Promise.resolve();
}

export function storageListKeys(): Promise<string[]> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (items) => resolve(Object.keys(items)));
    });
  }
  return Promise.resolve(Object.keys(localStorage));
}
