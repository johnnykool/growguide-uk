"use client";

import { useState } from "react";
import {
  ENVIRONMENT_OPTIONS,
  PLOT_SIZE_LABELS,
  PlotSize,
  UserProfile,
} from "@/lib/types";
import VegetableGrid from "./VegetableGrid";
import EquipmentSelector from "./EquipmentSelector";

interface Props {
  initial: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
}

// Standard UK postcode format, e.g. PR1 1AA, SW1A 2AA, M1 1AE.
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

interface LookupResult {
  lat: number;
  lng: number;
  region: string;
  postcode: string;
}

export default function SetupWizard({ initial, onSave, onCancel }: Props) {
  const [postcode, setPostcode] = useState(initial?.postcode ?? "");
  const [lookup, setLookup] = useState<LookupResult | null>(
    initial
      ? {
          lat: initial.lat,
          lng: initial.lng,
          region: initial.region,
          postcode: initial.postcode,
        }
      : null
  );
  const [lookupState, setLookupState] = useState<
    "idle" | "loading" | "error" | "invalid"
  >("idle");
  const [vegetables, setVegetables] = useState<string[]>(
    initial?.vegetables ?? []
  );
  const [plotSize, setPlotSize] = useState<PlotSize>(
    initial?.plotSize ?? "medium"
  );
  const [environment, setEnvironment] = useState<string[]>(
    initial?.environment ?? []
  );
  const [equipment, setEquipment] = useState<string[]>(
    initial?.equipment ?? []
  );
  const [attempted, setAttempted] = useState(false);

  async function lookupPostcode(value: string) {
    const trimmed = value.trim();
    if (!UK_POSTCODE_RE.test(trimmed)) {
      setLookup(null);
      setLookupState("invalid");
      return;
    }
    setLookupState("loading");
    try {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      if (!res.ok || !data.result) {
        setLookup(null);
        setLookupState("error");
        return;
      }
      const r = data.result;
      setLookup({
        lat: r.latitude,
        lng: r.longitude,
        // Scotland/Wales/NI have no "region" field — fall back to country.
        region: r.region ?? r.country ?? "United Kingdom",
        postcode: r.postcode,
      });
      setPostcode(r.postcode);
      setLookupState("idle");
    } catch {
      setLookup(null);
      setLookupState("error");
    }
  }

  function toggle(
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    id: string
  ) {
    setList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const canSave = lookup !== null && vegetables.length > 0;

  function handleSave() {
    setAttempted(true);
    if (!canSave || !lookup) return;
    onSave({
      postcode: lookup.postcode,
      lat: lookup.lat,
      lng: lookup.lng,
      region: lookup.region,
      vegetables,
      plotSize,
      environment,
      equipment,
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl mb-2">GrowGuide UK</h1>
          <p className="text-moss">
            {initial
              ? "Update your plot details below."
              : "Tell us about your plot and we'll help you grow — one season at a time."}
          </p>
        </header>

        <div className="space-y-6">
          {/* 1. Postcode */}
          <section className="bg-warm-stone/50 rounded-card shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-2xl mb-1">1. Where do you garden?</h2>
            <p className="text-sm text-moss mb-4">
              Your postcode lets us tailor advice to your local weather and
              region.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value);
                  setLookup(null);
                  setLookupState("idle");
                }}
                onBlur={() => postcode.trim() && lookupPostcode(postcode)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") lookupPostcode(postcode);
                }}
                placeholder="e.g. PR1 1AA"
                autoCapitalize="characters"
                className="flex-1 rounded-btn bg-cream px-4 py-3 text-dark-earth placeholder:text-moss/60 outline-none ring-1 ring-light-sage focus:ring-2 focus:ring-moss"
              />
              <button
                type="button"
                onClick={() => lookupPostcode(postcode)}
                className="rounded-btn bg-moss px-5 py-3 font-medium text-cream hover:bg-dark-earth transition-colors"
              >
                {lookupState === "loading" ? "Checking…" : "Check postcode"}
              </button>
            </div>
            <div className="mt-3 min-h-[1.5rem] text-sm" aria-live="polite">
              {lookupState === "invalid" && (
                <p className="text-terracotta">
                  That doesn&apos;t look like a UK postcode — try the format
                  &ldquo;PR1 1AA&rdquo;.
                </p>
              )}
              {lookupState === "error" && (
                <p className="text-terracotta">
                  We couldn&apos;t find that postcode. Check it and try again.
                </p>
              )}
              {lookup && (
                <p className="text-dark-earth">
                  📍 <span className="font-semibold">{lookup.postcode}</span>{" "}
                  — {lookup.region}
                </p>
              )}
              {attempted && !lookup && lookupState === "idle" && (
                <p className="text-terracotta">
                  Please enter and check your postcode first.
                </p>
              )}
            </div>
          </section>

          {/* 2. Vegetables */}
          <section className="bg-warm-stone/50 rounded-card shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-2xl mb-1">
              2. What would you like to grow?
            </h2>
            <p className="text-sm text-moss mb-4">
              Tap to select — choose at least one.
              {vegetables.length > 0 && (
                <span className="ml-1 font-semibold text-dark-earth">
                  {vegetables.length} selected.
                </span>
              )}
            </p>
            <VegetableGrid
              selected={vegetables}
              onToggle={(id) => toggle(setVegetables, id)}
            />
            {attempted && vegetables.length === 0 && (
              <p className="mt-3 text-sm text-terracotta">
                Choose at least one vegetable to continue.
              </p>
            )}
          </section>

          {/* 3. Plot details */}
          <section className="bg-warm-stone/50 rounded-card shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-2xl mb-1">3. Your plot</h2>
            <p className="text-sm text-moss mb-4">
              Size and growing environment help us keep advice realistic.
            </p>
            <label className="block text-sm font-semibold mb-1" htmlFor="plot-size">
              Plot size
            </label>
            <select
              id="plot-size"
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value as PlotSize)}
              className="w-full rounded-btn bg-cream px-4 py-3 text-dark-earth outline-none ring-1 ring-light-sage focus:ring-2 focus:ring-moss mb-5"
            >
              {(Object.keys(PLOT_SIZE_LABELS) as PlotSize[]).map((size) => (
                <option key={size} value={size}>
                  {PLOT_SIZE_LABELS[size]}
                </option>
              ))}
            </select>
            <p className="text-sm font-semibold mb-2">
              Growing environment <span className="font-normal text-moss">(select all that apply)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {ENVIRONMENT_OPTIONS.map((env) => {
                const isSelected = environment.includes(env.id);
                return (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => toggle(setEnvironment, env.id)}
                    aria-pressed={isSelected}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-blush text-dark-earth ring-1 ring-terracotta/40"
                        : "bg-cream text-dark-earth ring-1 ring-light-sage hover:bg-light-sage/50"
                    }`}
                  >
                    {env.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. Equipment */}
          <section className="bg-warm-stone/50 rounded-card shadow-soft p-5 sm:p-6">
            <h2 className="font-serif text-2xl mb-1">4. Your tool shed</h2>
            <p className="text-sm text-moss mb-4">
              Tick what you already own — we&apos;ll only suggest jobs you can
              actually do.
            </p>
            <EquipmentSelector
              selected={equipment}
              onToggle={(id) => toggle(setEquipment, id)}
            />
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button
              type="button"
              onClick={handleSave}
              className={`flex-1 rounded-btn px-6 py-4 text-lg font-semibold text-cream transition-colors ${
                canSave
                  ? "bg-dark-earth hover:bg-moss"
                  : "bg-moss/50 cursor-not-allowed"
              }`}
            >
              Save &amp; Continue
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-btn px-6 py-4 font-medium text-dark-earth ring-1 ring-light-sage hover:bg-light-sage/40 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
