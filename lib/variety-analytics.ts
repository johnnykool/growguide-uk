import { track } from "@vercel/analytics";
import { VARIETY_CROPS } from "./variety-crops";

const VISIT_KEY = "growguide:variety-visit";
const RETURN_WINDOW = 24 * 60 * 60 * 1000;

export function rememberVarietyVisit(crop: string) {
  try {
    sessionStorage.setItem(VISIT_KEY, JSON.stringify({ crop, at: Date.now() }));
  } catch { /* Optional measurement must not affect the guide. */ }
}

export function trackGrowGuideReturn() {
  try {
    const raw = sessionStorage.getItem(VISIT_KEY);
    if (!raw) return;
    sessionStorage.removeItem(VISIT_KEY);
    const visit = JSON.parse(raw);
    const age = Date.now() - visit.at;
    // Allow only published crop identifiers, never arbitrary stored input.
    if (VARIETY_CROPS.some(crop => crop.slug === visit.crop) && typeof visit.at === "number" && age >= 0 && age < RETURN_WINDOW) {
      track("grow_guide_return", { crop: visit.crop });
    }
  } catch { /* Storage and analytics can be blocked independently. */ }
}

export function trackSeedClick(crop: string, variety: string, retailer: string, affiliate: boolean) {
  try {
    track("seed_link_click", { crop, variety, retailer, affiliate });
  } catch { /* A measurement failure must not prevent opening the retailer. */ }
}
