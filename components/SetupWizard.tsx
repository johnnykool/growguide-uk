"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatCropCount } from "@/lib/format";
import { HERO_SOIL } from "@/lib/images";
import { loadSetupDraft, saveSetupDraft } from "@/lib/storage";
import {
  ENVIRONMENT_OPTIONS,
  PLOT_SIZE_LABELS,
  PlotSize,
  UserProfile,
} from "@/lib/types";
import EquipmentSelector from "./EquipmentSelector";
import SetupProgress from "./SetupProgress";
import VegetableGrid from "./VegetableGrid";

interface Props {
  initial: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3 | 4;

interface LookupResult {
  lat: number;
  lng: number;
  region: string;
  postcode: string;
}

const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

function normaliseActiveStep(
  requestedStep: Step,
  lookup: LookupResult | null,
  vegetables: string[],
): Step {
  if (!lookup) return 1;
  if (vegetables.length === 0 && requestedStep > 2) return 2;
  return requestedStep;
}

export default function SetupWizard({ initial, onSave, onCancel }: Props) {
  const [restoredDraft] = useState(() =>
    initial ? null : loadSetupDraft(),
  );
  const initialLookup =
    restoredDraft?.lookup ??
    (initial
      ? {
          lat: initial.lat,
          lng: initial.lng,
          region: initial.region,
          postcode: initial.postcode,
        }
      : null);
  const initialVegetables =
    restoredDraft?.vegetables ?? initial?.vegetables ?? [];
  const initialActiveStep = normaliseActiveStep(
    restoredDraft?.activeStep ?? 1,
    initialLookup,
    initialVegetables,
  );
  const [activeStep, setActiveStep] = useState<Step>(
    initialActiveStep,
  );
  const [completedSteps, setCompletedSteps] = useState<number[]>(() =>
    restoredDraft
      ? Array.from({ length: initialActiveStep - 1 }, (_, index) =>
          index + 1,
        )
      : [],
  );
  const [postcode, setPostcode] = useState(
    restoredDraft?.postcode ?? initial?.postcode ?? "",
  );
  const [lookup, setLookup] = useState<LookupResult | null>(
    initialLookup,
  );
  const [lookupState, setLookupState] = useState<
    "idle" | "loading" | "error" | "invalid"
  >("idle");
  const [vegetables, setVegetables] = useState<string[]>(
    initialVegetables,
  );
  const [plotSize, setPlotSize] = useState<PlotSize>(
    restoredDraft?.plotSize ?? initial?.plotSize ?? "medium",
  );
  const [environment, setEnvironment] = useState<string[]>(
    restoredDraft?.environment ?? initial?.environment ?? [],
  );
  const [equipment, setEquipment] = useState<string[]>(
    restoredDraft?.equipment ?? initial?.equipment ?? [],
  );
  const [showAllCrops, setShowAllCrops] = useState(
    restoredDraft?.showAllCrops ?? false,
  );
  const [showAllEquipment, setShowAllEquipment] = useState(
    restoredDraft?.showAllEquipment ?? false,
  );
  const [cropSearch, setCropSearch] = useState("");
  const headings = useRef<Partial<Record<Step, HTMLHeadingElement | null>>>({});
  const postcodeInput = useRef<HTMLInputElement | null>(null);
  const cropSelection = useRef<HTMLDivElement | null>(null);
  const hadCropSelection = useRef(vegetables.length > 0);
  const pendingFocus = useRef<"heading" | "requirement" | null>(null);
  const postcodeRequestId = useRef(0);

  const reachableCompletedSteps = completedSteps.filter((step) => {
    if (!lookup) return false;
    if (step === 1) return true;
    return vegetables.length > 0;
  });

  const summaries: Partial<Record<Step, string>> = {
    1: lookup ? `${lookup.postcode} · ${lookup.region}` : undefined,
    2: `${formatCropCount(vegetables.length)} selected`,
    3: PLOT_SIZE_LABELS[plotSize],
    4:
      equipment.length === 0
        ? "No tools selected"
        : `${equipment.length} ${equipment.length === 1 ? "tool" : "tools"} selected`,
  };

  useEffect(
    () => () => {
      postcodeRequestId.current += 1;
    },
    [],
  );

  useEffect(() => {
    saveSetupDraft({
      version: 1,
      activeStep,
      postcode,
      lookup,
      vegetables,
      plotSize,
      environment,
      equipment,
      showAllCrops,
      showAllEquipment,
    });
  }, [
    activeStep,
    postcode,
    lookup,
    vegetables,
    plotSize,
    environment,
    equipment,
    showAllCrops,
    showAllEquipment,
  ]);

  useEffect(() => {
    if (pendingFocus.current === "heading") {
      headings.current[activeStep]?.focus();
    } else if (pendingFocus.current === "requirement") {
      if (activeStep === 1) postcodeInput.current?.focus();
      if (activeStep === 2) cropSelection.current?.focus();
    }
    pendingFocus.current = null;
  }, [activeStep]);

  useEffect(() => {
    if (
      hadCropSelection.current &&
      vegetables.length === 0 &&
      activeStep === 2
    ) {
      cropSelection.current?.focus();
    }
    hadCropSelection.current = vegetables.length > 0;
  }, [activeStep, vegetables.length]);

  async function lookupPostcode(value: string) {
    const requestId = ++postcodeRequestId.current;
    const trimmed = value.trim();
    if (!UK_POSTCODE_RE.test(trimmed)) {
      setLookup(null);
      setLookupState("invalid");
      postcodeInput.current?.focus();
      return;
    }
    setLookupState("loading");
    try {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`,
      );
      const data = await res.json();
      if (requestId !== postcodeRequestId.current) return;
      if (!res.ok || !data.result) {
        setLookup(null);
        setLookupState("error");
        postcodeInput.current?.focus();
        return;
      }
      const result = data.result;
      setLookup({
        lat: result.latitude,
        lng: result.longitude,
        region: result.region ?? result.country ?? "United Kingdom",
        postcode: result.postcode,
      });
      setPostcode(result.postcode);
      setLookupState("idle");
    } catch {
      if (requestId !== postcodeRequestId.current) return;
      setLookup(null);
      setLookupState("error");
      postcodeInput.current?.focus();
    }
  }

  function toggle(
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    id: string,
  ) {
    setList((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  function openStep(requestedStep: Step) {
    const reachableStep = normaliseActiveStep(
      requestedStep,
      lookup,
      vegetables,
    );

    if (reachableStep === activeStep) {
      if (reachableStep === 1) postcodeInput.current?.focus();
      if (reachableStep === 2) cropSelection.current?.focus();
      return;
    }

    pendingFocus.current =
      reachableStep === requestedStep ? "heading" : "requirement";
    setActiveStep(reachableStep);
  }

  function completeAndOpen(step: Step) {
    setCompletedSteps((previous) =>
      previous.includes(activeStep) ? previous : [...previous, activeStep],
    );
    openStep(step);
  }

  function handleSave() {
    if (!lookup || vegetables.length === 0) return;
    setCompletedSteps((previous) =>
      previous.includes(4) ? previous : [...previous, 4],
    );
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

  const headingProps = (step: Step) => ({
    ref: (node: HTMLHeadingElement | null) => {
      headings.current[step] = node;
    },
    tabIndex: -1,
    className: `mb-1 font-serif text-2xl ${focusRing}`,
  });

  return (
    <main>
      <section className="relative h-44 sm:h-56">
        <Image
          src={HERO_SOIL}
          alt="Hands holding rich garden soil"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-earth/70 via-dark-earth/10 to-transparent" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-3xl flex-col justify-end px-4 pb-5">
            <h1 className="font-serif text-3xl text-cream sm:text-4xl">
              {initial ? "Update your plot" : "Tell us about your plot"}
            </h1>
            <p className="text-sm text-cream/85">
              {initial
                ? "Change anything below, then save."
                : "We'll tailor advice to your patch — one season at a time."}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <SetupProgress
          activeStep={activeStep}
          completedSteps={reachableCompletedSteps}
          summaries={summaries}
          onEdit={openStep}
        />

        {activeStep === 1 && (
          <section className="rounded-card bg-warm-stone/50 p-5 shadow-soft sm:p-6">
            <h2 {...headingProps(1)}>
              1. Where do you garden?{" "}
              <span className="font-sans text-sm font-normal text-moss">
                (required)
              </span>
            </h2>
            <p className="mb-2 text-sm text-moss">
              Your postcode lets us tailor advice to your local weather and
              region.
            </p>
            <p id="postcode-help" className="mb-4 text-sm text-moss">
              Your postcode is used for local weather and stored on this device.
            </p>
            <label htmlFor="setup-postcode" className="mb-1 block text-sm font-semibold">
              UK postcode <span className="font-normal text-moss">(required)</span>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={postcodeInput}
                id="setup-postcode"
                type="text"
                value={postcode}
                onChange={(event) => {
                  postcodeRequestId.current += 1;
                  setPostcode(event.target.value);
                  setLookup(null);
                  setLookupState("idle");
                }}
                onBlur={() => postcode.trim() && lookupPostcode(postcode)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") lookupPostcode(postcode);
                }}
                placeholder="e.g. PR1 1AA"
                autoCapitalize="characters"
                aria-required="true"
                aria-invalid={lookupState === "invalid" || lookupState === "error"}
                aria-describedby={
                  lookup
                    ? "postcode-help postcode-feedback"
                    : "postcode-help postcode-feedback location-requirement"
                }
                className={`min-h-11 flex-1 rounded-btn bg-cream px-4 py-3 text-dark-earth placeholder:text-moss/60 ring-1 ring-light-sage ${focusRing}`}
              />
              <button
                type="button"
                onClick={() => lookupPostcode(postcode)}
                disabled={lookupState === "loading"}
                className={`min-h-11 rounded-btn bg-moss px-5 py-3 font-medium text-cream transition-colors hover:bg-dark-earth disabled:cursor-wait disabled:opacity-70 ${focusRing}`}
              >
                {lookupState === "loading" ? "Checking…" : "Check postcode"}
              </button>
            </div>
            <div
              id="postcode-feedback"
              className="mt-3 min-h-6 text-sm"
              aria-live="polite"
            >
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
                  📍 <span className="font-semibold">{lookup.postcode}</span> —{" "}
                  {lookup.region}
                </p>
              )}
            </div>
            {!lookup && (
              <p id="location-requirement" className="mt-2 text-sm text-terracotta">
                Check your postcode to continue.
              </p>
            )}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => completeAndOpen(2)}
                disabled={!lookup}
                className={`min-h-11 rounded-btn px-5 py-3 font-semibold text-cream transition-colors ${focusRing} ${
                  lookup
                    ? "bg-dark-earth hover:bg-moss"
                    : "cursor-not-allowed bg-moss/50"
                }`}
              >
                Continue to crops
              </button>
            </div>
          </section>
        )}

        {activeStep === 2 && (
          <section className="rounded-card bg-warm-stone/50 p-5 shadow-soft sm:p-6">
            <h2 {...headingProps(2)}>
              2. What would you like to grow?{" "}
              <span className="font-sans text-sm font-normal text-moss">
                (required)
              </span>
            </h2>
            <p className="mb-4 text-sm text-moss">
              Select at least one crop you grow now or would like to grow.
              {vegetables.length > 0 && (
                <span className="ml-1 font-semibold text-dark-earth">
                  {formatCropCount(vegetables.length)} selected.
                </span>
              )}
            </p>
            <div
              ref={cropSelection}
              role="group"
              aria-label="Crop selection"
              aria-required="true"
              aria-invalid={vegetables.length === 0}
              aria-describedby={
                vegetables.length === 0 ? "crop-requirement" : undefined
              }
              tabIndex={-1}
              className={focusRing}
            >
              <VegetableGrid
                selected={vegetables}
                onToggle={(id) => toggle(setVegetables, id)}
                showAll={showAllCrops}
                onShowAllChange={setShowAllCrops}
                search={cropSearch}
                onSearchChange={setCropSearch}
              />
            </div>
            {vegetables.length === 0 && (
              <p id="crop-requirement" className="mt-3 text-sm text-terracotta">
                Select at least one crop to continue.
              </p>
            )}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => openStep(1)}
                className={`min-h-11 rounded-btn px-5 py-3 font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 ${focusRing}`}
              >
                Back to location
              </button>
              <button
                type="button"
                onClick={() => completeAndOpen(3)}
                disabled={vegetables.length === 0}
                className={`min-h-11 rounded-btn px-5 py-3 font-semibold text-cream transition-colors ${focusRing} ${
                  vegetables.length > 0
                    ? "bg-dark-earth hover:bg-moss"
                    : "cursor-not-allowed bg-moss/50"
                }`}
              >
                Continue to plot
              </button>
            </div>
          </section>
        )}

        {activeStep === 3 && (
          <section className="rounded-card bg-warm-stone/50 p-5 shadow-soft sm:p-6">
            <h2 {...headingProps(3)}>
              3. Your plot{" "}
              <span className="font-sans text-sm font-normal text-moss">
                (optional)
              </span>
            </h2>
            <p className="mb-1 text-sm text-moss">
              Size and growing environment help us keep advice realistic.
            </p>
            <p className="mb-4 text-sm text-moss">
              Optional — you can change this later.
            </p>
            <label className="mb-1 block text-sm font-semibold" htmlFor="plot-size">
              Plot size
            </label>
            <select
              id="plot-size"
              value={plotSize}
              onChange={(event) => setPlotSize(event.target.value as PlotSize)}
              className={`mb-5 min-h-11 w-full rounded-btn bg-cream px-4 py-3 text-dark-earth ring-1 ring-light-sage ${focusRing}`}
            >
              {(Object.keys(PLOT_SIZE_LABELS) as PlotSize[]).map((size) => (
                <option key={size} value={size}>
                  {PLOT_SIZE_LABELS[size]}
                </option>
              ))}
            </select>
            <p className="mb-2 text-sm font-semibold">
              Growing environment{" "}
              <span className="font-normal text-moss">(select all that apply)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {ENVIRONMENT_OPTIONS.map((item) => {
                const isSelected = environment.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(setEnvironment, item.id)}
                    aria-pressed={isSelected}
                    className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors ${focusRing} ${
                      isSelected
                        ? "bg-blush text-dark-earth ring-1 ring-terracotta/40"
                        : "bg-cream text-dark-earth ring-1 ring-light-sage hover:bg-light-sage/50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => openStep(2)}
                className={`min-h-11 rounded-btn px-5 py-3 font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 ${focusRing}`}
              >
                Back to crops
              </button>
              <button
                type="button"
                onClick={() => completeAndOpen(4)}
                className={`min-h-11 rounded-btn bg-dark-earth px-5 py-3 font-semibold text-cream transition-colors hover:bg-moss ${focusRing}`}
              >
                Continue to tools
              </button>
            </div>
          </section>
        )}

        {activeStep === 4 && (
          <section className="rounded-card bg-warm-stone/50 p-5 shadow-soft sm:p-6">
            <h2 {...headingProps(4)}>
              4. Your tool shed{" "}
              <span className="font-sans text-sm font-normal text-moss">
                (optional)
              </span>
            </h2>
            <p className="mb-1 text-sm text-moss">
              Tick what you already own — we&apos;ll only suggest jobs you can
              actually do.
            </p>
            <p className="mb-4 text-sm text-moss">
              Optional — skip this if you are still building your tool shed.
            </p>
            <EquipmentSelector
              selected={equipment}
              onToggle={(id) => toggle(setEquipment, id)}
              showAll={showAllEquipment}
              onShowAllChange={setShowAllEquipment}
            />
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => openStep(3)}
                className={`min-h-11 rounded-btn px-5 py-3 font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 ${focusRing}`}
              >
                Back to plot
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                {equipment.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className={`min-h-11 rounded-btn px-5 py-3 font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 ${focusRing}`}
                  >
                    Skip tools and finish
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  className={`min-h-11 rounded-btn bg-dark-earth px-5 py-3 font-semibold text-cream transition-colors hover:bg-moss ${focusRing}`}
                >
                  Save my garden
                </button>
              </div>
            </div>
          </section>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`min-h-11 rounded-btn px-6 py-3 font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 ${focusRing}`}
          >
            Cancel
          </button>
        )}
      </div>
    </main>
  );
}
