import { PlotSize, SavedAdvice, SetupDraftV1, UserProfile } from "./types";

const STORAGE_KEY = "growguide-user";
const ADVICE_KEY = "growguide-advice";
const SETUP_DRAFT_KEY = "growguide-setup-draft-v1";
const PLOT_SIZES: PlotSize[] = ["windowsill", "small", "medium", "large"];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSetupDraftV1(value: unknown): value is SetupDraftV1 {
  if (!value || typeof value !== "object") return false;

  const draft = value as Record<string, unknown>;
  const lookup = draft.lookup;
  const validLookup =
    lookup === null ||
    (typeof lookup === "object" &&
      lookup !== null &&
      typeof (lookup as Record<string, unknown>).lat === "number" &&
      typeof (lookup as Record<string, unknown>).lng === "number" &&
      typeof (lookup as Record<string, unknown>).region === "string" &&
      typeof (lookup as Record<string, unknown>).postcode === "string");

  return (
    draft.version === 1 &&
    typeof draft.activeStep === "number" &&
    Number.isInteger(draft.activeStep) &&
    draft.activeStep >= 1 &&
    draft.activeStep <= 4 &&
    typeof draft.postcode === "string" &&
    validLookup &&
    isStringArray(draft.vegetables) &&
    typeof draft.plotSize === "string" &&
    PLOT_SIZES.includes(draft.plotSize as PlotSize) &&
    isStringArray(draft.environment) &&
    isStringArray(draft.equipment) &&
    typeof draft.showAllCrops === "boolean" &&
    typeof draft.showAllEquipment === "boolean"
  );
}

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

export function loadSetupDraft(): SetupDraftV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SETUP_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isSetupDraftV1(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSetupDraft(draft: SetupDraftV1): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETUP_DRAFT_KEY, JSON.stringify(draft));
}

export function clearSetupDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SETUP_DRAFT_KEY);
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
