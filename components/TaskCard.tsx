"use client";

import Image from "next/image";
import { VEGETABLES } from "@/data/vegetables";
import { vegPhoto } from "@/lib/images";
import { AdviceTask } from "@/lib/types";

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-terracotta text-cream",
  medium: "bg-blush text-dark-earth",
  low: "bg-light-sage text-dark-earth",
};

interface Props {
  task: AdviceTask;
  done: boolean;
  onToggle: () => void;
}

export default function TaskCard({ task, done, onToggle }: Props) {
  const veg = VEGETABLES.find(
    (v) => v.name.toLowerCase() === task.vegetable.toLowerCase()
  );
  const photo = veg ? vegPhoto(veg.id) : undefined;

  return (
    <article
      className={`rounded-card bg-cream shadow-soft ring-1 ring-light-sage/40 transition-opacity ${
        done ? "opacity-60" : ""
      }`}
    >
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="relative mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center">
              <input
                type="checkbox"
                checked={done}
                onChange={onToggle}
                aria-label={`Mark "${task.title}" as ${done ? "not done" : "done"}`}
                className="peer h-6 w-6 cursor-pointer appearance-none rounded-md bg-warm-stone/70 ring-1 ring-moss/40 transition-colors checked:bg-moss"
              />
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute h-4 w-4 fill-none stroke-cream stroke-[3.5] opacity-0 transition-opacity peer-checked:opacity-100"
                aria-hidden
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
            {photo ? (
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-btn">
                <Image
                  src={photo}
                  alt={task.vegetable}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
            ) : (
              <svg
                viewBox="0 0 48 48"
                className="h-12 w-12 shrink-0 fill-none stroke-moss stroke-[3]"
                aria-hidden
              >
                <rect x="7" y="9" width="34" height="30" rx="4" />
                <path d="M14 18h20M14 25h20M14 32h12" strokeLinecap="round" />
              </svg>
            )}
            <div>
              <p className="text-sm font-medium text-moss">{task.vegetable}</p>
              <h4
                className={`font-semibold leading-snug ${
                  done ? "line-through decoration-moss/60" : ""
                }`}
              >
                {task.title}
              </h4>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium
            }`}
          >
            {task.priority}
          </span>
        </div>
        <span className="mb-3 inline-block rounded-full bg-light-sage/60 px-3 py-0.5 text-xs font-medium text-dark-earth">
          {task.category}
        </span>
        <p className="text-sm leading-relaxed text-dark-earth/90">
          {task.detail}
        </p>
        {task.weatherNote && (
          <p className="mt-3 rounded-btn bg-sage/30 px-3 py-2 text-sm text-dark-earth">
            🌦️ {task.weatherNote}
          </p>
        )}
      </div>
    </article>
  );
}
