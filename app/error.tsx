"use client";

import Link from "next/link";
import { ArrowClockwise, ArrowRight } from "@phosphor-icons/react";
import { ICON_SIZE_INLINE, ICON_WEIGHT } from "@/lib/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col justify-center px-4 py-16 sm:py-24">
      <h1 className="font-serif text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl">
        That one didn&rsquo;t take
      </h1>
      <p className="mt-5 max-w-[55ch] text-lg leading-relaxed text-earth-ink">
        Something went wrong at our end, not yours. Your plot and your saved answers are
        untouched. Trying again usually settles it.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn bg-dark-earth px-5 py-3 font-semibold text-cream transition-colors hover:bg-earth-ink motion-safe:active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <ArrowClockwise size={ICON_SIZE_INLINE} weight={ICON_WEIGHT} aria-hidden="true" />
          Try again
        </button>
        <Link href="/" className="variety-text-link">
          Back to your Grow Guide
          <ArrowRight size={ICON_SIZE_INLINE} weight={ICON_WEIGHT} aria-hidden="true" />
        </Link>
      </div>

      {error.digest && (
        <p className="mt-10 border-t border-light-sage pt-5 font-mono text-sm text-earth-ink">
          <span className="sr-only">Error reference for support: </span>
          Reference {error.digest}
        </p>
      )}
    </main>
  );
}
