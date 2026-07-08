import { UserProfile } from "./types";

const STORAGE_KEY = "growguide-user";

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
