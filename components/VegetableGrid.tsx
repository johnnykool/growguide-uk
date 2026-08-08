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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

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
      className={`flex min-h-11 items-center gap-2 rounded-btn px-3 py-2 text-left text-sm transition-colors ${focusRing} ${
        selected
          ? "bg-blush text-dark-earth shadow-soft ring-1 ring-terracotta/40"
          : "bg-warm-stone/60 text-dark-earth hover:bg-light-sage/60"
      }`}
    >
      {VEG_PHOTOS[vegetable.id] ? (
        <Image
          src={VEG_PHOTOS[vegetable.id]}
          alt=""
          width={40}
          height={40}
          sizes="40px"
          className="h-10 w-10 shrink-0 rounded-btn object-cover"
        />
      ) : (
        <span className="text-xl" aria-hidden>
          {vegetable.emoji}
        </span>
      )}
      <span>
        <span className="block font-medium">{vegetable.name}</span>
        {marker && <span className="block text-xs text-moss">{marker.label}</span>}
      </span>
    </button>
  );
}

export default function VegetableGrid({
  selected,
  onToggle,
  month = new Date().getMonth() + 1,
  showAll = false,
  onShowAllChange = () => {},
  search = "",
  onSearchChange = () => {},
}: Props) {
  const recommendations = getSeasonalRecommendations(VEGETABLES, month);
  const normalisedSearch = search.trim().toLocaleLowerCase("en-GB");
  const matchingVegetables = VEGETABLES.filter((vegetable) =>
    vegetable.name.toLocaleLowerCase("en-GB").includes(normalisedSearch),
  );

  return (
    <div className="space-y-5">
      <div data-testid="seasonal-recommendations">
        <p className="mb-2 text-sm font-semibold text-dark-earth">
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
          className={`min-h-11 rounded-btn px-4 py-2 text-sm font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 ${focusRing}`}
        >
          Browse all crops
        </button>
      ) : (
        <div className="space-y-5">
          <div>
            <label htmlFor="crop-search" className="mb-1 block text-sm font-semibold text-dark-earth">
              Search crops
            </label>
            <input
              id="crop-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="e.g. tomato"
              className={`min-h-11 w-full rounded-btn bg-cream px-3 py-2 text-dark-earth placeholder:text-moss/60 ring-1 ring-light-sage ${focusRing}`}
            />
          </div>

          {matchingVegetables.length === 0 ? (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm text-moss">No crops match</p>
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className={`min-h-11 rounded-btn px-4 py-2 text-sm font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 ${focusRing}`}
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
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-moss">
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
