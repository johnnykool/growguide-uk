"use client";

import { useEffect, useRef } from "react";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdviceRefreshConfirm({ onConfirm, onCancel }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancelRef.current();
    };

    headingRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      returnFocus?.focus();
    };
  }, []);

  return (
    <div
      className="mt-4 rounded-card border border-dark-earth bg-blush/40 p-4 shadow-soft"
      role="region"
      aria-labelledby="advice-refresh-heading"
    >
      <h3
        id="advice-refresh-heading"
        ref={headingRef}
        tabIndex={-1}
        className="rounded-sm font-serif text-xl text-dark-earth focus:outline-none focus:ring-2 focus:ring-dark-earth focus:ring-offset-2 focus:ring-offset-cream"
      >
        Fresh advice will replace your current task list.
      </h3>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-btn bg-dark-earth px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-earth-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Replace my task list
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-btn bg-cream px-4 py-2 text-sm font-semibold text-dark-earth transition-colors hover:bg-warm-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Keep saved tasks
        </button>
      </div>
    </div>
  );
}
