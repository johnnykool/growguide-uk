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
      className="mt-4 border border-garden-ground bg-pale-mineral p-4"
      role="region"
      aria-labelledby="advice-refresh-heading"
    >
      <h3
        id="advice-refresh-heading"
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-semibold text-garden-ground focus:outline-none focus:ring-2 focus:ring-garden-ground focus:ring-offset-2 focus:ring-offset-pale-mineral"
      >
        Fresh advice will replace your current task list.
      </h3>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onConfirm}
          className="min-h-11 bg-rain-ink px-4 py-2 text-sm font-semibold text-pale-mineral transition-colors hover:bg-garden-ground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
        >
          Replace my task list
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 border border-garden-ground/40 bg-pale-mineral px-4 py-2 text-sm font-semibold text-garden-ground transition-colors hover:bg-garden-ground hover:text-pale-mineral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
        >
          Keep saved tasks
        </button>
      </div>
    </div>
  );
}
