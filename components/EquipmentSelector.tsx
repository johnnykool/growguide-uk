"use client";

import { EQUIPMENT_OPTIONS } from "@/lib/types";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
  showAll?: boolean;
  onShowAllChange?: (showAll: boolean) => void;
}

const COMMON_EQUIPMENT_IDS = new Set([
  "trowel",
  "watering-can",
  "spade",
  "fork",
  "secateurs",
  "seed-trays",
]);

const focusRing =
  "focus-within:ring-2 focus-within:ring-garden-ground focus-within:ring-offset-2 focus-within:ring-offset-pale-mineral";

export default function EquipmentSelector({
  selected,
  onToggle,
  showAll,
  onShowAllChange,
}: Props) {
  const isControlled = showAll !== undefined && onShowAllChange !== undefined;
  const equipment = !isControlled || showAll
    ? EQUIPMENT_OPTIONS
    : EQUIPMENT_OPTIONS.filter((item) => COMMON_EQUIPMENT_IDS.has(item.id));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 border-l border-t border-garden-ground/30">
        {equipment.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <label
              key={item.id}
              className={`flex min-h-11 items-center gap-3 border-b border-r border-garden-ground/30 px-3 py-2 text-sm transition-colors ${focusRing} ${
                isSelected
                  ? "bg-moss-veil/60 text-garden-ground"
                  : "bg-pale-mineral text-garden-ground hover:bg-moss-veil/25"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(item.id)}
                className="h-6 w-6 shrink-0 rounded-none accent-[var(--rain-ink)]"
              />
              <span className="font-medium">{item.label}</span>
            </label>
          );
        })}
      </div>
      {isControlled && !showAll && (
        <button
          type="button"
          onClick={() => onShowAllChange(true)}
          className="min-h-11 border border-garden-ground/40 px-4 py-2 text-sm font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
        >
          Show all tools
        </button>
      )}
    </div>
  );
}
