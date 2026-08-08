import { VEGETABLES } from "@/data/vegetables";
import { formatCropCount } from "@/lib/format";
import { getSeasonalMarker } from "@/lib/seasonal";
import { PLOT_SIZE_LABELS, UserProfile } from "@/lib/types";

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

  return (
    <section
      aria-label="Plot summary"
      className="rounded-card bg-sage/40 px-5 py-4 shadow-soft"
    >
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">
            Month
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">{monthLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">
            Your crops
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">
            {formatCropCount(profile.vegetables.length)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">
            In season
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">
            {activeCount} active this month
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">
            Plot
          </dt>
          <dd className="mt-1 font-semibold text-dark-earth">
            {PLOT_SIZE_LABELS[profile.plotSize]}
          </dd>
        </div>
      </dl>
    </section>
  );
}
