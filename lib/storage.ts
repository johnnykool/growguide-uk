import { VEGETABLES } from "@/data/vegetables";
import {
  ENVIRONMENT_OPTIONS,
  PlotSize,
  SavedAdvice,
  SetupDraftV2,
  UK_GARDEN_REGIONS,
  UserProfile,
} from "./types";

const STORAGE_KEY = "growguide-user";
const ADVICE_KEY = "growguide-advice";
const SETUP_DRAFT_KEY = "growguide-setup-draft-v1";
const PLOT_SIZES: PlotSize[] = ["windowsill", "small", "medium", "large"];
const VEGETABLE_IDS = new Set(VEGETABLES.map((vegetable) => vegetable.id));
const ENVIRONMENT_IDS = new Set(ENVIRONMENT_OPTIONS.map((item) => item.id));
const UK_REGIONS = new Set<string>(UK_GARDEN_REGIONS);
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

function isAllowedIdArray(
  value: unknown,
  allowed: Set<string>,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= allowed.size &&
    new Set(value).size === value.length &&
    value.every((item) => typeof item === "string" && allowed.has(item))
  );
}

function isFiniteCoordinate(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function isSetupDraftV2(value: unknown): value is SetupDraftV2 {
  if (!value || typeof value !== "object") return false;

  const draft = value as Record<string, unknown>;
  const lookup = draft.lookup;
  const validLookup =
    lookup === null ||
    (typeof lookup === "object" &&
      lookup !== null &&
      isFiniteCoordinate((lookup as Record<string, unknown>).lat, -90, 90) &&
      isFiniteCoordinate((lookup as Record<string, unknown>).lng, -180, 180) &&
      typeof (lookup as Record<string, unknown>).region === "string" &&
      UK_REGIONS.has((lookup as Record<string, unknown>).region as string) &&
      typeof (lookup as Record<string, unknown>).postcode === "string" &&
      UK_POSTCODE_RE.test(
        (lookup as Record<string, unknown>).postcode as string,
      ));

  return (
    draft.version === 2 &&
    typeof draft.activeStep === "number" &&
    Number.isInteger(draft.activeStep) &&
    draft.activeStep >= 1 &&
    draft.activeStep <= 3 &&
    typeof draft.postcode === "string" &&
    draft.postcode.length <= 12 &&
    validLookup &&
    isAllowedIdArray(draft.vegetables, VEGETABLE_IDS) &&
    typeof draft.plotSize === "string" &&
    PLOT_SIZES.includes(draft.plotSize as PlotSize) &&
    isAllowedIdArray(draft.environment, ENVIRONMENT_IDS) &&
    typeof draft.showAllCrops === "boolean"
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

export function saveProfile(profile: UserProfile): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
    return false;
  }
}

export function loadSetupDraft(): SetupDraftV2 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SETUP_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isSetupDraftV2(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSetupDraft(draft: SetupDraftV2): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETUP_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Draft persistence is best-effort; setup remains usable without storage.
  }
}

export function clearSetupDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SETUP_DRAFT_KEY);
  } catch {
    // Ignore unavailable storage so save and cancel flows can still complete.
  }
}

function normaliseProfileIds(values: string[]): string {
  return Array.from(new Set(values)).sort().join(",");
}

export function getAdviceProfileFingerprint(profile: UserProfile): string {
  return [
    "v1",
    profile.postcode.replace(/\s/g, "").toUpperCase(),
    String(profile.lat),
    String(profile.lng),
    profile.region.trim().toLowerCase(),
    normaliseProfileIds(profile.vegetables),
    profile.plotSize,
    normaliseProfileIds(profile.environment),
  ].join("|");
}

export function loadSavedAdvice(
  profile?: UserProfile | string,
): SavedAdvice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADVICE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedAdvice;
    if (
      typeof parsed.profileFingerprint !== "string" ||
      !parsed.advice ||
      !Array.isArray(parsed.advice.tasks) ||
      (profile &&
        parsed.profileFingerprint !==
          (typeof profile === "string"
            ? profile
            : getAdviceProfileFingerprint(profile)))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveAdvice(saved: SavedAdvice, profile?: UserProfile): boolean {
  if (typeof window === "undefined") return false;
  const scoped = profile
    ? { ...saved, profileFingerprint: getAdviceProfileFingerprint(profile) }
    : saved;
  if (!scoped.profileFingerprint) return false;
  try {
    window.localStorage.setItem(ADVICE_KEY, JSON.stringify(scoped));
    return true;
  } catch {
    // Advice remains available in memory when persistent storage is unavailable.
    return false;
  }
}

export function clearSavedAdvice(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ADVICE_KEY);
  } catch {
    // Ignore unavailable storage so the interface remains usable.
  }
}

// Stable key for ticking tasks off.
export function taskKey(vegetable: string, title: string): string {
  return `${vegetable}|${title}`;
}
