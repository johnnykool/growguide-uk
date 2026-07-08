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
    <div className="space-y-5">
      {/* Summary card */}
      <div className="rounded-card bg-sage/70 p-5 shadow-soft">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-serif text-xl">This period&apos;s priorities</h3>
          <span className="text-sm font-medium text-dark-earth/70">
            {generatedLabel && <>Generated {generatedLabel} · </>}
            {doneCount}/{advice.tasks.length} done
          </span>
        </div>
        <p className="leading-relaxed text-dark-earth/90">{advice.summary}</p>
        {advice.weatherWarnings.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {advice.weatherWarnings.map((w) => (
              <li
                key={w}
                className="rounded-btn bg-terracotta/90 px-3 py-2 text-sm font-medium text-cream"
              >
                ⚠️ {w}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blush text-dark-earth"
              : "bg-warm-stone/60 hover:bg-light-sage/60"
          }`}
        >
          All ({advice.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("high")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === "high"
              ? "bg-blush text-dark-earth"
              : "bg-warm-stone/60 hover:bg-light-sage/60"
          }`}
        >
          High priority ({advice.tasks.filter((t) => t.priority === "high").length})
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
          className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium outline-none ring-1 ring-light-sage ${
            filter === "category" ? "bg-blush text-dark-earth" : "bg-warm-stone/60"
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

      {/* Task cards grouped by vegetable */}
      {grouped.length === 0 ? (
        <p className="text-moss">No tasks match this filter.</p>
      ) : (
        grouped.map(([vegetable, tasks]) => (
          <section key={vegetable}>
            <h3 className="mb-2 font-serif text-lg text-dark-earth">
              {vegetable}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
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
