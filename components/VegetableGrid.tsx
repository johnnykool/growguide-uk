"use client";

import Image from "next/image";
import { CATEGORY_ORDER, VEGETABLES } from "@/data/vegetables";
import { VEG_PHOTOS } from "@/lib/images";
import { getSeasonalRecommendations } from "@/lib/seasonal";
import type { SeasonalMarkerInfo } from "@/lib/seasonal";
import type { Vegetable } from "@/lib/types";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
  month?: number;
  showAll?: boolean;
  onShowAllChange?: (showAll: boolean) => void;
  search?: string;
  onSearchChange?: (search: string) => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral";

function VegetableButton({
  vegetable,
  selected,
  onToggle,
  marker,
}: {
  vegetable: Vegetable;
  selected: boolean;
  onToggle: (id: string) => void;
  marker?: SeasonalMarkerInfo;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(vegetable.id)}
      aria-pressed={selected}
      className={`flex min-h-11 items-center gap-2 border px-3 py-2 text-left text-sm transition-colors ${focusRing} ${
        selected
          ? "border-garden-ground bg-moss-veil/60 text-garden-ground"
          : "border-garden-ground/35 bg-pale-mineral text-garden-ground hover:bg-moss-veil/25"
      }`}
    >
      {VEG_PHOTOS[vegetable.id] ? (
        <Image
          src={VEG_PHOTOS[vegetable.id]}
          alt=""
          width={40}
          height={40}
          sizes="40px"
          className="h-10 w-10 shrink-0 object-cover"
        />
      ) : (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-garden-ground/25 bg-moss-veil/30 text-sm font-semibold text-garden-ground"
          aria-hidden="true"
        >
          {vegetable.name.slice(0, 1)}
        </span>
      )}
      <span>
        <span className="block font-medium">{vegetable.name}</span>
        {marker && <span className="block text-xs text-rain-ink">{marker.label}</span>}
      </span>
    </button>
  );
}

export default function VegetableGrid({
  selected,
  onToggle,
  month = new Date().getMonth() + 1,
  showAll,
  onShowAllChange,
  search,
  onSearchChange,
}: Props) {
  const hasControlledDisclosure =
    showAll !== undefined && onShowAllChange !== undefined;
  const hasControlledSearch = search !== undefined && onSearchChange !== undefined;
  const isControlled = hasControlledDisclosure && hasControlledSearch;
  const recommendations = getSeasonalRecommendations(VEGETABLES, month);
  const normalisedSearch = (search ?? "").trim().toLocaleLowerCase("en-GB");
  const matchingVegetables = VEGETABLES.filter((vegetable) =>
    vegetable.name.toLocaleLowerCase("en-GB").includes(normalisedSearch),
  );

  if (!isControlled) {
    return (
      <div className="space-y-5">
        {CATEGORY_ORDER.map((category) => {
          const vegetables = VEGETABLES.filter(
            (vegetable) => vegetable.category === category,
          );
          if (vegetables.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-garden-ground/75">
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {vegetables.map((vegetable) => (
                  <VegetableButton
                    key={vegetable.id}
                    vegetable={vegetable}
                    selected={selected.includes(vegetable.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div data-testid="seasonal-recommendations">
        <p className="mb-2 text-sm font-semibold text-garden-ground">
          Good to grow this month
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {recommendations.map(({ vegetable, marker }) => (
            <VegetableButton
              key={vegetable.id}
              vegetable={vegetable}
              selected={selected.includes(vegetable.id)}
              onToggle={onToggle}
              marker={marker}
            />
          ))}
        </div>
      </div>

      {!showAll ? (
        <button
          type="button"
          onClick={() => onShowAllChange(true)}
          className={`min-h-11 border border-garden-ground/40 px-4 py-2 text-sm font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 ${focusRing}`}
        >
          Browse all crops
        </button>
      ) : (
        <div className="space-y-5">
          <div>
            <label htmlFor="crop-search" className="mb-1 block text-sm font-semibold text-garden-ground">
              Search crops
            </label>
            <input
              id="crop-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="e.g. tomato"
              className={`min-h-11 w-full border border-garden-ground/45 bg-pale-mineral px-3 py-2 text-garden-ground placeholder:text-garden-ground/60 ${focusRing}`}
            />
          </div>

          {matchingVegetables.length === 0 ? (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm text-garden-ground">No crops match</p>
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className={`min-h-11 border border-garden-ground/40 px-4 py-2 text-sm font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 ${focusRing}`}
              >
                Clear search
              </button>
            </div>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const vegetables = matchingVegetables.filter(
                (vegetable) => vegetable.category === category,
              );
              if (vegetables.length === 0) return null;

              return (
                <section key={category}>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-garden-ground/75">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {vegetables.map((vegetable) => (
                      <VegetableButton
                        key={vegetable.id}
                        vegetable={vegetable}
                        selected={selected.includes(vegetable.id)}
                        onToggle={onToggle}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
