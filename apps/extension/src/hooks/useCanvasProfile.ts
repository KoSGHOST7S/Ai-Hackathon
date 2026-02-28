import { useState, useEffect, useCallback } from "react";
import { storageGet, storageSet, storageRemove } from "@/lib/storage";

const STORAGE_KEY = "assignmint_canvas_profile";

interface CanvasProfile {
  canvasName: string | null;
  canvasAvatarUrl: string | null;
}

interface UseCanvasProfileReturn extends CanvasProfile {
  isLoaded: boolean;
  setProfile: (profile: CanvasProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
}

export function useCanvasProfile(): UseCanvasProfileReturn {
  const [profile, setProfileState] = useState<CanvasProfile>({
    canvasName: null,
    canvasAvatarUrl: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Read from storage on mount so the avatar is available immediately
  useEffect(() => {
    storageGet(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as CanvasProfile;
          setProfileState(parsed);
        } catch {
          // malformed cache — ignore, will be overwritten on next fetch
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const setProfile = useCallback(async (next: CanvasProfile) => {
    setProfileState(next);
    await storageSet(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const clearProfile = useCallback(async () => {
    setProfileState({ canvasName: null, canvasAvatarUrl: null });
    await storageRemove(STORAGE_KEY);
  }, []);

  return { ...profile, isLoaded, setProfile, clearProfile };
}
