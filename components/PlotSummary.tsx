import { getVegetableById, VEGETABLES } from "@/data/vegetables";
import { formatCropCount } from "@/lib/format";
import { getSeasonalMarker } from "@/lib/seasonal";
import {
  ENVIRONMENT_OPTIONS,
  PLOT_SIZE_LABELS,
  UserProfile,
} from "@/lib/types";

interface Props {
  profile: UserProfile;
  month?: number;
}

export default function PlotSummary({
  profile,
  month = new Date().getMonth() + 1,
}: Props) {
  const selectedIds = new Set(profile.vegetables);
  const activeCount = VEGETABLES.filter((vegetable) => {
    if (!selectedIds.has(vegetable.id)) return false;
    const marker = getSeasonalMarker(vegetable, month);
    return marker !== null && marker.kind !== "next-month";
  }).length;
  const monthLabel = new Date(2024, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
  });
  const selectedVegetables = profile.vegetables.flatMap((id) => {
    const vegetable = getVegetableById(id);
    return vegetable ? [vegetable] : [];
  });
  const environmentLabels = profile.environment.flatMap((id) => {
    const option = ENVIRONMENT_OPTIONS.find((item) => item.id === id);
    return option ? [option.label] : [];
  });
  const equipmentCount = profile.equipment.length;

  return (
    <section
      aria-label="Your plot profile"
      className="border border-dark-earth/30 bg-cream px-5 py-5 sm:px-6"
    >
      <div className="flex items-center gap-2">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 fill-black-flower"
        >
          <circle cx="10" cy="4.5" r="3" />
          <circle cx="15.2" cy="8.2" r="3" />
          <circle cx="13.2" cy="14.3" r="3" />
          <circle cx="6.8" cy="14.3" r="3" />
          <circle cx="4.8" cy="8.2" r="3" />
          <circle cx="10" cy="10" r="2.4" />
        </svg>
        <h2 className="text-xl font-semibold text-dark-earth">Your plot</h2>
      </div>

      <dl className="mt-5 grid gap-x-5 gap-y-4 border-y border-dark-earth/20 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-earth-ink">
            Month
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">{monthLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-earth-ink">
            Your crops
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">
            {formatCropCount(profile.vegetables.length)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-earth-ink">
            In season
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">
            {activeCount} active this month
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-earth-ink">
            Plot
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">
            {PLOT_SIZE_LABELS[profile.plotSize]}
          </dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(12rem,1fr)]">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-earth-ink">
            Selected crops
          </h3>
          <ul className="mt-2 grid gap-x-4 sm:grid-cols-2">
            {selectedVegetables.map((vegetable) => (
              <li
                key={vegetable.id}
                className="flex items-baseline justify-between gap-3 border-t border-dark-earth/20 py-2 text-sm"
              >
                <span className="text-xs uppercase tracking-wide text-earth-ink">
                  Crop
                </span>
                <span className="font-medium text-dark-earth">
                  {vegetable.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 text-sm lg:grid-cols-1">
          <div className="border-t border-dark-earth/20 py-2">
            <dt className="text-xs uppercase tracking-wide text-earth-ink">
              Conditions
            </dt>
            <dd className="mt-1 font-medium text-dark-earth">
              {environmentLabels.join(", ") || "Not specified"}
            </dd>
          </div>
          <div className="border-t border-dark-earth/20 py-2">
            <dt className="text-xs uppercase tracking-wide text-earth-ink">
              Equipment
            </dt>
            <dd className="mt-1 font-medium text-dark-earth">
              {equipmentCount} {equipmentCount === 1 ? "tool" : "tools"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
