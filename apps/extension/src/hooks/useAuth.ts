import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { AuthResponse, LoginRequest, SignupRequest } from "shared";

const STORAGE_KEY = "assignmint_jwt";

function storageGet(key: string): Promise<string | null> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => resolve(result[key] ?? null));
    });
  }
  return Promise.resolve(localStorage.getItem(key));
}

function storageSet(key: string, value: string): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  localStorage.setItem(key, value);
  return Promise.resolve();
}

function storageRemove(key: string): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, resolve);
    });
  }
  localStorage.removeItem(key);
  return Promise.resolve();
}

export interface AuthState {
  jwt: string | null;
  user: { id: string; email: string } | null;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ jwt: null, user: null, isLoading: true });

  useEffect(() => {
    storageGet(STORAGE_KEY).then((jwt) => {
      if (jwt) {
        try {
          const payload = JSON.parse(atob(jwt.split(".")[1])) as {
            userId: string;
            email: string;
          };
          setState({ jwt, user: { id: payload.userId, email: payload.email }, isLoading: false });
        } catch {
          setState({ jwt: null, user: null, isLoading: false });
        }
      } else {
        setState({ jwt: null, user: null, isLoading: false });
      }
    });
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    const res = await apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    await storageSet(STORAGE_KEY, res.jwt);
    setState({ jwt: res.jwt, user: res.user, isLoading: false });
    return res;
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    await storageSet(STORAGE_KEY, res.jwt);
    setState({ jwt: res.jwt, user: res.user, isLoading: false });
    return res;
  }, []);

  const logout = useCallback(async () => {
    await storageRemove(STORAGE_KEY);
    setState({ jwt: null, user: null, isLoading: false });
  }, []);

  return { ...state, signup, login, logout };
}
