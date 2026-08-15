import { getVegetableById } from "@/data/vegetables";
import {
  ENVIRONMENT_OPTIONS,
  PLOT_SIZE_LABELS,
  type PlotSize,
} from "@/lib/types";
import BlackFlowerMark from "./BlackFlowerMark";

export interface GardenPortraitProps {
  postcode?: string;
  region?: string;
  vegetables: string[];
  plotSize: PlotSize;
  environment: string[];
  equipment: string[];
  variant: "setup" | "dashboard";
  className?: string;
}

export type GardenPortraitData = Omit<
  GardenPortraitProps,
  "variant" | "className"
>;

const PLOT_FIELD_GUIDES: Record<
  PlotSize,
  { bandCount: number; frameClassName: string }
> = {
  windowsill: {
    bandCount: 2,
    frameClassName: "mx-auto w-1/2 border-x-4",
  },
  small: {
    bandCount: 3,
    frameClassName: "mx-auto w-3/4 border-x-2",
  },
  medium: {
    bandCount: 4,
    frameClassName: "mx-auto w-[90%] border-x",
  },
  large: {
    bandCount: 6,
    frameClassName: "w-full border-2",
  },
};

function EnvironmentStructure({ id }: { id: string }) {
  const structure = (() => {
    switch (id) {
      case "open-ground":
        return (
          <>
            <path d="M3 9h26M3 16h26M3 23h26" />
            <path d="m7 6 3 3-3 3m10-3 3 3-3 3m7 5 3 3-3 3" />
          </>
        );
      case "raised-beds":
        return (
          <>
            <rect x="3" y="6" width="26" height="7" />
            <rect x="3" y="19" width="26" height="7" />
            <path d="M8 6v7m8-7v7m8-7v7M11 19v7m10-7v7" />
          </>
        );
      case "greenhouse":
        return (
          <>
            <path d="M3 27V12L10 4h12l7 8v15H3Z" />
            <path d="M10 4v23m12-23v23M3 12h26M16 12v15" />
          </>
        );
      case "polytunnel":
        return (
          <>
            <path d="M3 27V15C3 7.8 8.8 2 16 2s13 5.8 13 13v12H3Z" />
            <path d="M10 27V14a6 6 0 0 1 12 0v13M3 20h26" />
          </>
        );
      case "containers":
        return (
          <>
            <path d="M3 11h9l-1 16H4L3 11Zm17 3h9l-1 13h-7l-1-13Z" />
            <path d="M7.5 11V6m17 8V8M4 7h7m17 3h-7" />
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <svg
      aria-hidden="true"
      data-environment-structure={id}
      focusable="false"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="1.5"
      className="h-7 w-8 shrink-0 text-garden-ground"
    >
      {structure}
    </svg>
  );
}

export function getGardenPortraitModel(props: GardenPortraitData) {
  const resolved = props.vegetables.flatMap((id) => {
    const vegetable = getVegetableById(id);
    return vegetable
      ? [{ id, name: vegetable.name, category: vegetable.category }]
      : [];
  });

  const environments = props.environment.flatMap((id) => {
    const option = ENVIRONMENT_OPTIONS.find((item) => item.id === id);
    return option ? [{ id: option.id, label: option.label }] : [];
  });

  return {
    crops: resolved.slice(0, 6),
    remainingCropCount: Math.max(0, resolved.length - 6),
    plotLabel: PLOT_SIZE_LABELS[props.plotSize],
    environments,
    environmentLabels: environments.map((item) => item.label),
    equipmentCount: props.equipment.length,
  };
}

export default function GardenPortrait({
  postcode,
  region,
  vegetables,
  plotSize,
  environment,
  equipment,
  variant,
  className,
}: GardenPortraitProps) {
  const model = getGardenPortraitModel({
    vegetables,
    plotSize,
    environment,
    equipment,
  });
  const location = [postcode, region].filter(Boolean).join(" · ");
  const hasCrops = model.crops.length > 0;
  const fieldGuide = PLOT_FIELD_GUIDES[plotSize];
  const isEmptyGrid = !hasCrops && model.environments.length === 0;

  return (
    <section
      aria-label="Your garden portrait"
      data-portrait-variant={variant}
      className={`border border-garden-ground/30 bg-pale-mineral p-5 text-garden-ground sm:p-6 ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-garden-ground/20 pb-4">
        <div className="flex items-center gap-3">
          <BlackFlowerMark className="h-8 w-8 shrink-0 text-black-flower" />
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">
              Garden portrait
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-garden-ground/70">
              Schematic — not to scale
            </p>
          </div>
        </div>
        {location && (
          <p className="max-w-[18rem] text-right text-sm font-medium text-garden-ground/75">
            {location}
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.72fr)]">
        <div
          data-plot-size={plotSize}
          data-portrait-field="true"
          className="aspect-square border border-garden-ground/40 bg-moss-veil/25 p-3"
        >
          <div
            data-testid="garden-field-grid"
            data-empty-grid={isEmptyGrid ? "true" : undefined}
            className={`relative flex h-full flex-col overflow-hidden border-garden-ground/45 bg-pale-mineral/45 ${fieldGuide.frameClassName}`}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col"
            >
              {Array.from({ length: fieldGuide.bandCount }, (_, index) => (
                <span
                  key={index}
                  data-field-guide-band="true"
                  className="grid flex-1 grid-cols-2 border-b border-garden-ground/30 odd:bg-moss-veil/20 last:border-b-0"
                >
                  <span
                    data-field-guide-cell="true"
                    className="border-r border-garden-ground/20"
                  />
                  <span data-field-guide-cell="true" />
                </span>
              ))}
            </div>

            <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-2 p-2">
              {hasCrops ? (
                <div className="grid min-h-0 flex-1 auto-rows-fr border border-garden-ground/35 bg-pale-mineral/90">
                  {model.crops.map((crop) => (
                    <div
                      key={crop.id}
                      className="flex min-h-0 items-center justify-between gap-3 border-b border-garden-ground/30 px-3 text-sm last:border-b-0"
                    >
                      <span className="font-medium text-garden-ground">
                        {crop.name}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-garden-ground/65">
                        {crop.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 items-center justify-center px-3 text-center">
                  <p className="border border-garden-ground/35 bg-pale-mineral px-4 py-3 text-sm font-medium leading-6 text-garden-ground/75">
                    Your selections will shape this portrait.
                  </p>
                </div>
              )}

              {model.environments.length > 0 && (
                <ul
                  aria-label="Selected growing environments"
                  className="grid shrink-0 grid-cols-2 gap-px border border-garden-ground/35 bg-garden-ground/25 sm:grid-cols-3"
                >
                  {model.environments.map((item) => (
                    <li
                      key={item.id}
                      className="flex min-h-10 items-center gap-2 bg-pale-mineral/95 px-2 py-1.5"
                    >
                      <EnvironmentStructure id={item.id} />
                      <span className="text-[11px] font-semibold leading-tight text-garden-ground">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="border-y border-garden-ground/20">
          <dl className="divide-y divide-garden-ground/20">
            <div className="py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-garden-ground/70">
                Plot
              </dt>
              <dd className="mt-1 font-semibold text-garden-ground">
                {model.plotLabel}
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-garden-ground/70">
                Conditions
              </dt>
              <dd className="mt-1 font-semibold text-garden-ground">
                {model.environmentLabels.join(", ") || "Not specified"}
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-garden-ground/70">
                Equipment
              </dt>
              <dd className="mt-1 font-semibold text-garden-ground">
                {model.equipmentCount} {model.equipmentCount === 1 ? "tool" : "tools"}
              </dd>
            </div>
          </dl>

          {model.remainingCropCount > 0 && (
            <p className="border-t border-garden-ground/20 py-3 text-sm font-semibold text-rain-ink">
              +{model.remainingCropCount} {model.remainingCropCount === 1 ? "crop" : "crops"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
