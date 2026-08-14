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

export function getGardenPortraitModel(props: GardenPortraitData) {
  const resolved = props.vegetables.flatMap((id) => {
    const vegetable = getVegetableById(id);
    return vegetable
      ? [{ id, name: vegetable.name, category: vegetable.category }]
      : [];
  });

  return {
    crops: resolved.slice(0, 6),
    remainingCropCount: Math.max(0, resolved.length - 6),
    plotLabel: PLOT_SIZE_LABELS[props.plotSize],
    environmentLabels: props.environment.flatMap((id) => {
      const option = ENVIRONMENT_OPTIONS.find((item) => item.id === id);
      return option ? [option.label] : [];
    }),
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
          {hasCrops ? (
            <div className="grid h-full grid-rows-6 border border-garden-ground/35">
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
            <div className="flex h-full items-center justify-center border border-garden-ground/35 px-5 text-center text-sm font-medium leading-6 text-garden-ground/75">
              Your selections will shape this portrait.
            </div>
          )}
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
