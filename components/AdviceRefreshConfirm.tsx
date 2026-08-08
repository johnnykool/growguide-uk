"use client";

import { useEffect, useRef } from "react";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdviceRefreshConfirm({ onConfirm, onCancel }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      className="mt-4 rounded-card border border-terracotta/40 bg-blush/40 p-4 shadow-soft"
      role="region"
      aria-labelledby="advice-refresh-heading"
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel();
      }}
    >
      <h3
        id="advice-refresh-heading"
        ref={headingRef}
        tabIndex={-1}
        className="rounded-sm font-serif text-xl text-dark-earth focus:outline-none focus:ring-2 focus:ring-moss focus:ring-offset-2"
      >
        Fresh advice will replace your current task list.
      </h3>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-btn bg-moss px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-dark-earth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
        >
          Replace my task list
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-btn bg-cream px-4 py-2 text-sm font-semibold text-dark-earth transition-colors hover:bg-warm-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
        >
          Keep saved tasks
        </button>
      </div>
    </div>
  );
}
