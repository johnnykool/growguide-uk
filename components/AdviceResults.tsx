"use client";

import { useMemo, useState } from "react";
import { AdviceResponse, AdviceTask } from "@/lib/types";
import { taskKey } from "@/lib/storage";
import TaskCard from "./TaskCard";

interface Props {
  advice: AdviceResponse;
  generatedAt?: string;
  completed: Record<string, boolean>;
  onToggleTask: (key: string) => void;
}

type Filter = "all" | "high" | "category";

export default function AdviceResults({
  advice,
  generatedAt,
  completed,
  onToggleTask,
}: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [category, setCategory] = useState<string>("");

  const categories = useMemo(
    () => Array.from(new Set(advice.tasks.map((t) => t.category))),
    [advice.tasks]
  );

  const doneCount = advice.tasks.filter(
    (t) => completed[taskKey(t.vegetable, t.title)]
  ).length;

  const visibleTasks = useMemo(() => {
    if (filter === "high") return advice.tasks.filter((t) => t.priority === "high");
    if (filter === "category" && category)
      return advice.tasks.filter((t) => t.category === category);
    return advice.tasks;
  }, [advice.tasks, filter, category]);

  // Group tasks by vegetable, preserving first-appearance order.
  const grouped = useMemo(() => {
    const map = new Map<string, AdviceTask[]>();
    for (const task of visibleTasks) {
      const bucket = map.get(task.vegetable) ?? [];
      bucket.push(task);
      map.set(task.vegetable, bucket);
    }
    return Array.from(map.entries());
  }, [visibleTasks]);

  const generatedLabel = generatedAt
    ? new Date(generatedAt).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="space-y-6">
      <div className="border-y border-garden-ground/25 py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold text-garden-ground">
            This period&apos;s priorities
          </h3>
          <span className="text-sm font-medium text-garden-ground/65">
            {generatedLabel && <>Generated {generatedLabel} · </>}
            {doneCount}/{advice.tasks.length} done
          </span>
        </div>
        <p className="mt-2 leading-relaxed text-garden-ground/85">
          {advice.summary}
        </p>
        {advice.weatherWarnings.length > 0 && (
          <ul className="mt-4 space-y-2 border-l-2 border-ember pl-4">
            {advice.weatherWarnings.map((w) => (
              <li key={w} className="text-sm font-medium text-ember-ink">
                {w}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-garden-ground/20 pb-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`min-h-11 border-b-2 px-1 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral ${
            filter === "all"
              ? "border-rain-ink text-rain-ink"
              : "border-transparent text-garden-ground/70 hover:text-garden-ground"
          }`}
        >
          All ({advice.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("high")}
          className={`min-h-11 border-b-2 px-1 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral ${
            filter === "high"
              ? "border-ember-ink text-ember-ink"
              : "border-transparent text-garden-ground/70 hover:text-garden-ground"
          }`}
        >
          High priority (
          {advice.tasks.filter((t) => t.priority === "high").length})
        </button>
        <select
          value={filter === "category" ? category : ""}
          onChange={(e) => {
            if (e.target.value) {
              setCategory(e.target.value);
              setFilter("category");
            } else {
              setFilter("all");
            }
          }}
          aria-label="Filter tasks by category"
          className={`min-h-11 cursor-pointer border px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral ${
            filter === "category"
              ? "border-rain-ink bg-pale-mineral text-rain-ink"
              : "border-garden-ground/35 bg-pale-mineral text-garden-ground"
          }`}
        >
          <option value="">By category…</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {grouped.length === 0 ? (
        <p className="text-garden-ground/65">No tasks match this filter.</p>
      ) : (
        grouped.map(([vegetable, tasks]) => (
          <section key={vegetable}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-garden-ground/70">
              {vegetable}
            </h3>
            <div className="divide-y divide-garden-ground/20 border-y border-garden-ground/20">
              {tasks.map((task) => {
                const key = taskKey(task.vegetable, task.title);
                return (
                  <TaskCard
                    key={key}
                    task={task}
                    done={!!completed[key]}
                    onToggle={() => onToggleTask(key)}
                  />
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
