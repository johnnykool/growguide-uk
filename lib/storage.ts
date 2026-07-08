import { SavedAdvice, UserProfile } from "./types";

const STORAGE_KEY = "growguide-user";
const ADVICE_KEY = "growguide-advice";

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (
      !parsed.postcode ||
      typeof parsed.lat !== "number" ||
      typeof parsed.lng !== "number" ||
      !Array.isArray(parsed.vegetables) ||
      parsed.vegetables.length === 0
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function loadSavedAdvice(): SavedAdvice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADVICE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedAdvice;
    if (!parsed.advice || !Array.isArray(parsed.advice.tasks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAdvice(saved: SavedAdvice): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADVICE_KEY, JSON.stringify(saved));
}

export function clearSavedAdvice(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADVICE_KEY);
}

// Stable key for ticking tasks off.
export function taskKey(vegetable: string, title: string): string {
  return `${vegetable}|${title}`;
}
