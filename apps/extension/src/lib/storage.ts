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
