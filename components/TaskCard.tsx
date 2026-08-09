"use client";

import { AdviceTask } from "@/lib/types";

interface Props {
  task: AdviceTask;
  done: boolean;
  onToggle: () => void;
}

function taskTone(task: AdviceTask) {
  if (
    task.priority === "high" ||
    ["protection", "pest control", "disease prevention"].includes(
      task.category,
    )
  ) {
    return { rail: "bg-ember", text: "text-ember-ink" };
  }
  if (["sowing", "planting", "harvest"].includes(task.category)) {
    return { rail: "bg-moss-veil", text: "text-garden-ground" };
  }
  return { rail: "bg-sky-blue", text: "text-rain-ink" };
}

export default function TaskCard({ task, done, onToggle }: Props) {
  const tone = taskTone(task);

  return (
    <article
      className={`relative bg-pale-mineral py-5 pl-5 pr-1 ring-1 ring-garden-ground/40 transition-opacity ${
        done ? "opacity-60" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${tone.rail}`}
      />
      <div className="flex items-start gap-3">
        <label className="relative -mt-1 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            checked={done}
            onChange={onToggle}
            aria-label={`Mark "${task.title}" as ${done ? "not done" : "done"}`}
            className="peer h-6 w-6 cursor-pointer appearance-none border border-garden-ground/50 bg-pale-mineral transition-colors checked:border-garden-ground checked:bg-garden-ground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
          />
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute h-4 w-4 fill-none stroke-pale-mineral stroke-[3.5] opacity-0 transition-opacity peer-checked:opacity-100"
            aria-hidden
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-garden-ground/65">
                {task.vegetable}
              </p>
              <h4
                className={`mt-1 text-base font-semibold leading-snug text-garden-ground ${
                  done ? "line-through decoration-garden-ground/50" : ""
                }`}
              >
                {task.title}
              </h4>
            </div>
            <p
              className={`flex items-center gap-2 text-xs font-semibold ${tone.text}`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 ${tone.rail}`}
              />
              {task.category} · {task.priority} priority
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-garden-ground/85">
            {task.detail}
          </p>
          {task.weatherNote && (
            <p className="mt-3 border-l-2 border-sky-blue pl-3 text-sm text-rain-ink">
              {task.weatherNote}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
