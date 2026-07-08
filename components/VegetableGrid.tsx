"use client";

import { CATEGORY_ORDER, VEGETABLES } from "@/data/vegetables";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export default function VegetableGrid({ selected, onToggle }: Props) {
  return (
    <div className="space-y-5">
      {CATEGORY_ORDER.map((category) => {
        const veggies = VEGETABLES.filter((v) => v.category === category);
        if (veggies.length === 0) return null;
        return (
          <div key={category}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-moss mb-2">
              {category}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {veggies.map((veg) => {
                const isSelected = selected.includes(veg.id);
                return (
                  <button
                    key={veg.id}
                    type="button"
                    onClick={() => onToggle(veg.id)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-2 rounded-btn px-3 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-blush text-dark-earth shadow-soft ring-1 ring-terracotta/40"
                        : "bg-warm-stone/60 text-dark-earth hover:bg-light-sage/60"
                    }`}
                  >
                    <span className="text-xl" aria-hidden>
                      {veg.emoji}
                    </span>
                    <span className="font-medium">{veg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
