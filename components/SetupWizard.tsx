"use client";

import { useEffect, useRef, useState } from "react";
import { formatCropCount } from "@/lib/format";
import { loadSetupDraft, saveSetupDraft } from "@/lib/storage";
import {
  ENVIRONMENT_OPTIONS,
  PLOT_SIZE_LABELS,
  PlotSize,
  UserProfile,
} from "@/lib/types";
import EquipmentSelector from "./EquipmentSelector";
import BrandMark from "./BrandMark";
import SetupProgress from "./SetupProgress";
import VegetableGrid from "./VegetableGrid";

interface Props {
  initial: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
  saveError?: string | null;
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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral";

const setupPanel =
  "border border-garden-ground/30 bg-pale-mineral p-5 text-garden-ground sm:p-6";

function normaliseActiveStep(
  requestedStep: Step,
  lookup: LookupResult | null,
  vegetables: string[],
): Step {
  if (!lookup) return 1;
  if (vegetables.length === 0 && requestedStep > 2) return 2;
  return requestedStep;
}

export default function SetupWizard({
  initial,
  onSave,
  onCancel,
  saveError,
}: Props) {
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
    className: `mb-1 text-2xl font-semibold text-garden-ground ${focusRing}`,
  });

  return (
    <main className="bg-pale-mineral text-garden-ground">
      <section className="relative overflow-hidden border-b border-pale-mineral/20 bg-garden-ground text-pale-mineral">
        <svg
          aria-hidden="true"
          viewBox="0 0 720 160"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-3/5 text-sky-blue opacity-60"
        >
          <path
            className="rain-path"
            d="M12 20 C210 30 310 62 708 118"
            fill="none"
            stroke="currentColor"
            strokeDasharray="8 12"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            className="rain-path"
            d="M96 2 C250 52 438 48 710 146"
            fill="none"
            stroke="currentColor"
            strokeDasharray="4 11"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
        <div className="relative mx-auto flex max-w-3xl items-start gap-5 px-4 py-8 sm:py-10">
          <BrandMark className="mt-1 h-11 w-11 shrink-0 text-sky-blue" />
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-pale-mineral sm:text-4xl">
              {initial ? "Update your garden" : "Tell us about your garden"}
            </h1>
            <p className="mt-2 text-base text-pale-mineral/80">
              Four short steps. Saved on this device.
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
          <section className={setupPanel}>
            <h2 {...headingProps(1)}>
              1. Where do you garden?{" "}
              <span className="font-sans text-sm font-normal text-garden-ground/70">
                (required)
              </span>
            </h2>
            <p className="mb-2 text-base text-garden-ground/80">
              Your postcode lets us tailor advice to your local weather and
              region.
            </p>
            <p id="postcode-help" className="mb-4 text-base text-garden-ground/80">
              Your postcode is used for local weather and stored on this device.
            </p>
            <label htmlFor="setup-postcode" className="mb-1 block text-sm font-semibold">
              UK postcode <span className="font-normal text-garden-ground/70">(required)</span>
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
                className={`min-h-11 flex-1 border border-garden-ground/45 bg-pale-mineral px-4 py-3 text-garden-ground placeholder:text-garden-ground/60 ${focusRing}`}
              />
              <button
                type="button"
                onClick={() => lookupPostcode(postcode)}
                disabled={lookupState === "loading"}
                className={`min-h-11 bg-rain-ink px-5 py-3 font-medium text-pale-mineral transition-colors hover:bg-garden-ground disabled:cursor-wait disabled:opacity-70 ${focusRing}`}
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
                <p className="text-ember-ink">
                  That doesn&apos;t look like a UK postcode — try the format
                  &ldquo;PR1 1AA&rdquo;.
                </p>
              )}
              {lookupState === "error" && (
                <p className="text-ember-ink">
                  We couldn&apos;t find that postcode. Check it and try again.
                </p>
              )}
              {lookup && (
                <p className="flex items-center gap-2 text-garden-ground">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 fill-none stroke-rain-ink stroke-2"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span><span className="font-semibold">{lookup.postcode}</span> — {lookup.region}</span>
                </p>
              )}
            </div>
            {!lookup && (
              <p id="location-requirement" className="mt-2 text-sm text-ember-ink">
                Check your postcode to continue.
              </p>
            )}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => completeAndOpen(2)}
                disabled={!lookup}
                className={`min-h-11 px-5 py-3 font-semibold transition-colors ${focusRing} ${
                  lookup
                    ? "bg-rain-ink text-pale-mineral hover:bg-garden-ground"
                    : "cursor-not-allowed bg-moss-veil/60 text-garden-ground/65"
                }`}
              >
                Continue to crops
              </button>
            </div>
          </section>
        )}

        {activeStep === 2 && (
          <section className={setupPanel}>
            <h2 {...headingProps(2)}>
              2. What would you like to grow?{" "}
              <span className="font-sans text-sm font-normal text-garden-ground/70">
                (required)
              </span>
            </h2>
            <p className="mb-4 text-base text-garden-ground/80">
              Select at least one crop you grow now or would like to grow.
              {vegetables.length > 0 && (
                <span className="ml-1 font-semibold text-garden-ground">
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
              <p id="crop-requirement" className="mt-3 text-sm text-ember-ink">
                Select at least one crop to continue.
              </p>
            )}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => openStep(1)}
                className={`min-h-11 border border-garden-ground/40 px-5 py-3 font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 ${focusRing}`}
              >
                Back to location
              </button>
              <button
                type="button"
                onClick={() => completeAndOpen(3)}
                disabled={vegetables.length === 0}
                className={`min-h-11 px-5 py-3 font-semibold transition-colors ${focusRing} ${
                  vegetables.length > 0
                    ? "bg-rain-ink text-pale-mineral hover:bg-garden-ground"
                    : "cursor-not-allowed bg-moss-veil/60 text-garden-ground/65"
                }`}
              >
                Continue to plot
              </button>
            </div>
          </section>
        )}

        {activeStep === 3 && (
          <section className={setupPanel}>
            <h2 {...headingProps(3)}>
              3. Your plot{" "}
              <span className="font-sans text-sm font-normal text-garden-ground/70">
                (optional)
              </span>
            </h2>
            <p className="mb-1 text-base text-garden-ground/80">
              Size and growing environment help us keep advice realistic.
            </p>
            <p className="mb-4 text-base text-garden-ground/80">
              Optional — you can change this later.
            </p>
            <label className="mb-1 block text-sm font-semibold" htmlFor="plot-size">
              Plot size
            </label>
            <select
              id="plot-size"
              value={plotSize}
              onChange={(event) => setPlotSize(event.target.value as PlotSize)}
              className={`mb-5 min-h-11 w-full border border-garden-ground/45 bg-pale-mineral px-4 py-3 text-garden-ground ${focusRing}`}
            >
              {(Object.keys(PLOT_SIZE_LABELS) as PlotSize[]).map((size) => (
                <option key={size} value={size}>
                  {PLOT_SIZE_LABELS[size]}
                </option>
              ))}
            </select>
            <p className="mb-2 text-sm font-semibold">
              Growing environment{" "}
              <span className="font-normal text-garden-ground/70">(select all that apply)</span>
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
                    className={`min-h-11 border px-4 py-2 text-sm font-medium transition-colors ${focusRing} ${
                      isSelected
                        ? "border-garden-ground bg-moss-veil/60 text-garden-ground"
                        : "border-garden-ground/35 bg-pale-mineral text-garden-ground hover:bg-moss-veil/25"
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
                className={`min-h-11 border border-garden-ground/40 px-5 py-3 font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 ${focusRing}`}
              >
                Back to crops
              </button>
              <button
                type="button"
                onClick={() => completeAndOpen(4)}
                className={`min-h-11 bg-rain-ink px-5 py-3 font-semibold text-pale-mineral transition-colors hover:bg-garden-ground ${focusRing}`}
              >
                Continue to tools
              </button>
            </div>
          </section>
        )}

        {activeStep === 4 && (
          <section className={setupPanel}>
            <h2 {...headingProps(4)}>
              4. Your tool shed{" "}
              <span className="font-sans text-sm font-normal text-garden-ground/70">
                (optional)
              </span>
            </h2>
            <p className="mb-1 text-base text-garden-ground/80">
              Tick what you already own — we&apos;ll only suggest jobs you can
              actually do.
            </p>
            <p className="mb-4 text-base text-garden-ground/80">
              Optional — skip this if you are still building your tool shed.
            </p>
            <EquipmentSelector
              selected={equipment}
              onToggle={(id) => toggle(setEquipment, id)}
              showAll={showAllEquipment}
              onShowAllChange={setShowAllEquipment}
            />
            {saveError && (
              <p role="alert" className="mt-4 text-sm font-semibold text-ember-ink">
                {saveError}
              </p>
            )}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => openStep(3)}
                className={`min-h-11 border border-garden-ground/40 px-5 py-3 font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 ${focusRing}`}
              >
                Back to plot
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                {equipment.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className={`min-h-11 border border-garden-ground/40 px-5 py-3 font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 ${focusRing}`}
                  >
                    Skip tools and finish
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  className={`min-h-11 bg-rain-ink px-5 py-3 font-semibold text-pale-mineral transition-colors hover:bg-garden-ground ${focusRing}`}
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
            className={`min-h-11 border border-garden-ground/40 px-6 py-3 font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 ${focusRing}`}
          >
            Cancel
          </button>
        )}
      </div>
    </main>
  );
}
