import { useState, useEffect, useCallback } from "react";
import { storageGet, storageSet, storageRemove } from "@/lib/storage";

const STORAGE_KEY = "assignmint_canvas_profile";
const AVATAR_CACHE_TTL_MS = 5 * 60 * 1000;

interface CanvasProfile {
  canvasName: string | null;
  canvasAvatarUrl: string | null;
}

interface StoredCanvasProfile extends CanvasProfile {
  canvasAvatarDataUrl: string | null;
  canvasAvatarCachedAt: number | null;
}

interface UseCanvasProfileReturn extends CanvasProfile {
  canvasAvatarDataUrl: string | null;
  isLoaded: boolean;
  setProfile: (profile: CanvasProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
}

function parseStoredProfile(raw: string | null): StoredCanvasProfile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredCanvasProfile>;
    return {
      canvasName: parsed.canvasName ?? null,
      canvasAvatarUrl: parsed.canvasAvatarUrl ?? null,
      canvasAvatarDataUrl: parsed.canvasAvatarDataUrl ?? null,
      canvasAvatarCachedAt: typeof parsed.canvasAvatarCachedAt === "number" ? parsed.canvasAvatarCachedAt : null,
    };
  } catch {
    return null;
  }
}

function hasFreshAvatarData(profile: StoredCanvasProfile, avatarUrl: string | null): boolean {
  if (!avatarUrl) return false;
  if (!profile.canvasAvatarDataUrl) return false;
  if (profile.canvasAvatarUrl !== avatarUrl) return false;
  if (typeof profile.canvasAvatarCachedAt !== "number") return false;
  return Date.now() - profile.canvasAvatarCachedAt < AVATAR_CACHE_TTL_MS;
}

async function fetchAvatarDataUrl(avatarUrl: string): Promise<string | null> {
  try {
    const res = await fetch(avatarUrl, { cache: "force-cache" });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.type.startsWith("image/")) return null;
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Failed to convert avatar to data URL"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function useCanvasProfile(): UseCanvasProfileReturn {
  const [profile, setProfileState] = useState<StoredCanvasProfile>({
    canvasName: null,
    canvasAvatarUrl: null,
    canvasAvatarDataUrl: null,
    canvasAvatarCachedAt: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Read from storage on mount so the avatar is available immediately
  useEffect(() => {
    storageGet(STORAGE_KEY).then((raw) => {
      const parsed = parseStoredProfile(raw);
      if (parsed) setProfileState(parsed);
      setIsLoaded(true);
    });
  }, []);

  const setProfile = useCallback(async (next: CanvasProfile) => {
    const existing = parseStoredProfile(await storageGet(STORAGE_KEY)) ?? {
      canvasName: null,
      canvasAvatarUrl: null,
      canvasAvatarDataUrl: null,
      canvasAvatarCachedAt: null,
    };

    let merged: StoredCanvasProfile = {
      ...existing,
      canvasName: next.canvasName,
      canvasAvatarUrl: next.canvasAvatarUrl,
    };

    if (!next.canvasAvatarUrl) {
      merged = { ...merged, canvasAvatarDataUrl: null, canvasAvatarCachedAt: null };
      setProfileState(merged);
      await storageSet(STORAGE_KEY, JSON.stringify(merged));
      return;
    }

    if (hasFreshAvatarData(merged, next.canvasAvatarUrl)) {
      setProfileState(merged);
      await storageSet(STORAGE_KEY, JSON.stringify(merged));
      return;
    }

    // Keep metadata immediately; refresh image payload in background.
    merged = { ...merged, canvasAvatarDataUrl: null, canvasAvatarCachedAt: null };
    setProfileState(merged);
    await storageSet(STORAGE_KEY, JSON.stringify(merged));

    const dataUrl = await fetchAvatarDataUrl(next.canvasAvatarUrl);
    if (!dataUrl) return;

    const refreshed: StoredCanvasProfile = {
      ...merged,
      canvasAvatarDataUrl: dataUrl,
      canvasAvatarCachedAt: Date.now(),
    };
    setProfileState(refreshed);
    await storageSet(STORAGE_KEY, JSON.stringify(refreshed));
  }, []);

  const clearProfile = useCallback(async () => {
    setProfileState({
      canvasName: null,
      canvasAvatarUrl: null,
      canvasAvatarDataUrl: null,
      canvasAvatarCachedAt: null,
    });
    await storageRemove(STORAGE_KEY);
  }, []);

  return { ...profile, isLoaded, setProfile, clearProfile };
}
