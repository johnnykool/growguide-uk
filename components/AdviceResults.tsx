"use client";

import { useMemo, useState } from "react";
import { AdviceResponse, AdviceTask } from "@/lib/types";
import TaskCard from "./TaskCard";

interface Props {
  advice: AdviceResponse;
}

type Filter = "all" | "high" | "category";

export default function AdviceResults({ advice }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [category, setCategory] = useState<string>("");

  const categories = useMemo(
    () => Array.from(new Set(advice.tasks.map((t) => t.category))),
    [advice.tasks]
  );

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

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div className="bg-sage/70 rounded-card shadow-soft p-5">
        <h3 className="font-serif text-xl mb-2">This period&apos;s priorities</h3>
        <p className="text-dark-earth/90 leading-relaxed">{advice.summary}</p>
        {advice.weatherWarnings.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {advice.weatherWarnings.map((w) => (
              <li
                key={w}
                className="rounded-btn bg-terracotta/90 text-cream px-3 py-2 text-sm font-medium"
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
          className={`rounded-full px-4 py-1.5 text-sm font-medium outline-none ring-1 ring-light-sage cursor-pointer ${
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
            <h3 className="font-serif text-lg text-dark-earth mb-2">
              {vegetable}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {tasks.map((task, i) => (
                <TaskCard key={`${vegetable}-${i}`} task={task} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
