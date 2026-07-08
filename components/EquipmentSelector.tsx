"use client";

import { EQUIPMENT_OPTIONS } from "@/lib/types";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export default function EquipmentSelector({ selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {EQUIPMENT_OPTIONS.map((item) => {
        const isSelected = selected.includes(item.id);
        return (
          <label
            key={item.id}
            className={`flex items-center gap-2.5 rounded-btn px-3 py-2.5 text-sm cursor-pointer transition-colors ${
              isSelected
                ? "bg-blush text-dark-earth"
                : "bg-warm-stone/60 hover:bg-light-sage/60"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 accent-[var(--moss)]"
            />
            <span className="font-medium">{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}
