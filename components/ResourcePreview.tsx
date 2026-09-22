"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ResourceEdition } from "@/data/resources";

const buttonStyle = "min-h-11 rounded-btn border border-dark-earth px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth";
export default function ResourcePreview({ title, editions }: { title: string; editions: ResourceEdition[] }) {
  const [editionIndex, setEditionIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const edition = editions[editionIndex];
  const preview = edition.previews[pageIndex];

  useEffect(() => {
    if (viewport.current) { viewport.current.scrollTop = 0; viewport.current.scrollLeft = 0; }
  }, [pageIndex, editionIndex]);
  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [expanded]);
  function closeExpanded() {
    setExpanded(false);
    requestAnimationFrame(() => expandButton.current?.focus());
  }
  const content = <>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-card border border-light-sage bg-warm-stone/50 p-3">
      <div role="group" aria-label={`${edition.format} preview pages`} className="flex items-center gap-2">
        {edition.previews.map((page, index) => <button key={page.src} type="button" aria-pressed={pageIndex === index} onClick={() => setPageIndex(index)} className={`${buttonStyle} ${pageIndex === index ? "bg-dark-earth text-cream" : "bg-cream"}`}>Page {index + 1}</button>)}
      </div>
      <div className="flex items-center gap-2">
        <select aria-label="Preview zoom" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="min-h-11 rounded-btn border border-dark-earth bg-cream px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth">
          <option value={100}>Fit width</option><option value={125}>125%</option><option value={150}>150%</option><option value={200}>200%</option>
        </select>
        <button ref={expanded ? undefined : expandButton} type="button" aria-expanded={expanded} onClick={() => expanded ? closeExpanded() : setExpanded(true)} className={`${buttonStyle} bg-cream`}>{expanded ? "Close expanded view" : "Expand"}</button>
      </div>
    </div>
    <div ref={viewport} tabIndex={0} role="region" aria-label={`${title} scrollable preview`} className={`overflow-auto border border-t-0 border-light-sage bg-warm-stone/40 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth ${expanded ? "h-[calc(100dvh-180px)]" : "h-[75vh] min-h-[360px] max-h-[1080px]"}`}>
      <figure style={{ width: `${zoom}%` }} className="m-0">
        <Image src={preview.src} alt={preview.alt} width={preview.width} height={preview.height} sizes="(min-width: 1024px) 90vw, 100vw" className="h-auto w-full max-w-none bg-white" />
      </figure>
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-earth-ink">
      <span aria-live="polite">{edition.format} preview · Page {pageIndex + 1} of {edition.previews.length}</span>
      <div className="flex gap-4"><a href={edition.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Open PDF <span className="sr-only">(new tab)</span></a><a href={preview.src} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">Open full-size preview <span className="sr-only">(new tab)</span></a></div>
    </div>
    <p className="text-xs text-earth-ink">Scroll to read the page. Use zoom for small print.</p>
  </>;
  return <div className="min-w-0">
    <div role="group" aria-label={`${title} preview format`} className="mb-3 flex flex-wrap gap-2">
      {editions.map((option, index) => <button key={option.format} type="button" aria-pressed={editionIndex === index} onClick={() => { setEditionIndex(index); setPageIndex(0); }} className={`${buttonStyle} ${editionIndex === index ? "bg-dark-earth text-cream" : "bg-cream hover:bg-light-sage/40"}`}>{option.label}</button>)}
    </div>
    {expanded ? <dialog ref={dialog} aria-label={`${title} expanded preview`} onCancel={closeExpanded} onClose={closeExpanded} className="fixed inset-3 m-0 h-[calc(100dvh-24px)] max-h-none w-[calc(100%-24px)] max-w-none overflow-auto rounded-card bg-cream p-4 text-earth-ink backdrop:bg-black/60">{content}</dialog> : content}
  </div>;
}
