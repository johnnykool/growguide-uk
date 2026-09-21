"use client";

import Image from "next/image";
import { useState } from "react";
import type { ResourceEdition } from "@/data/resources";

export default function ResourcePreview({ title, editions }: {
  title: string;
  editions: ResourceEdition[];
}) {
  const [editionIndex, setEditionIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const edition = editions[editionIndex];
  const preview = edition.previews[pageIndex];

  return (
    <div>
      <div role="group" aria-label={`${title} preview format`} className="mb-4 flex flex-wrap gap-2">
        {editions.map((option, index) => (
          <button
            key={option.format}
            type="button"
            aria-pressed={editionIndex === index}
            onClick={() => { setEditionIndex(index); setPageIndex(0); }}
            className={`min-h-11 rounded-btn border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${editionIndex === index ? "border-dark-earth bg-dark-earth text-cream" : "border-moss bg-cream text-earth-ink hover:bg-light-sage/40"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <figure>
        <div className="flex justify-center rounded-card border border-light-sage bg-warm-stone/30 p-4 sm:p-6">
          <Image
            src={preview.src}
            alt={preview.alt}
            width={preview.width}
            height={preview.height}
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 600px, 90vw"
            className="h-auto max-h-[620px] w-full object-contain"
          />
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-earth-ink">
          <span aria-live="polite">{edition.format} preview · Page {pageIndex + 1} of {edition.previews.length}</span>
          <a
            href={preview.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth"
          >
            Open full-size preview <span className="sr-only">(new tab)</span>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></svg>
          </a>
        </figcaption>
      </figure>
      {edition.previews.length > 1 && (
        <div role="group" aria-label={`${edition.format} preview pages`} className="mt-2 flex gap-2">
          {edition.previews.map((page, index) => (
            <button
              key={page.src}
              type="button"
              aria-pressed={pageIndex === index}
              onClick={() => setPageIndex(index)}
              className={`min-h-11 rounded-btn border px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${pageIndex === index ? "border-dark-earth bg-dark-earth text-cream" : "border-moss text-earth-ink hover:bg-light-sage/40"}`}
            >Page {index + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
