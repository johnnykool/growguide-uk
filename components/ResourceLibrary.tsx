"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { RESOURCES } from "@/data/resources";
import { ICON_WEIGHT } from "@/lib/icons";
import ResourcePreview from "@/components/ResourcePreview";

export default function ResourceLibrary() {
  const [selected, setSelected] = useState(0);
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-12">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Resources</h1>
        <p className="mt-4 text-lg text-earth-ink">A little guidance to keep beside your seed packets. Browse our free printables, take a closer look, and find something useful for your patch.</p>
      </div>

      <div role="group" aria-label="Choose a resource" className="mt-8 flex flex-wrap gap-2">
        {RESOURCES.map((resource, index) => <button key={resource.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`min-h-11 rounded-btn border border-dark-earth px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth ${selected === index ? "bg-dark-earth text-cream" : "hover:bg-light-sage/40"}`}>{resource.subtitle}</button>)}
      </div>
      <div className="mt-7">
        {[RESOURCES[selected]].map((resource) => (
          <article key={resource.id} id={resource.id} aria-labelledby={`${resource.id}-title`} className="scroll-mt-24 border-t border-moss/50 pt-8 sm:pt-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <ResourcePreview title={resource.title} editions={resource.editions} />
              <div className="lg:sticky lg:top-24 lg:self-start lg:pt-1">
                <h2 id={`${resource.id}-title`} className="font-serif text-3xl leading-tight sm:text-4xl">{resource.title}</h2>
                <p className="mt-3 text-lg font-semibold text-earth-ink">{resource.subtitle}</p>
                <p className="mt-5 max-w-xl text-earth-ink">{resource.description}</p>
                <ul className="mt-6 list-disc space-y-3 pl-5 text-earth-ink marker:text-dark-earth">
                  {resource.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>

                <div className="mt-8 border-t border-moss/40 pt-6">
                  <h3 className="font-serif text-2xl">Your copy to keep</h3>
                  <p className="mt-2 text-sm text-earth-ink">Free to download. No sign-up needed.</p>
                  <div className="mt-5 space-y-5">
                    {resource.editions.map((edition) => (
                      <div key={edition.format}>
                        <a href={edition.href} download className="inline-flex min-h-11 items-center justify-center gap-3 rounded-btn bg-dark-earth px-5 py-3 font-semibold text-cream transition-colors hover:bg-earth-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
                          <DownloadSimple size={18} weight={ICON_WEIGHT} aria-hidden="true" />
                          Download {edition.format} PDF
                        </a>
                        <p className="mt-2 text-sm text-earth-ink">{edition.description} · {edition.fileSize}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-7 max-w-xl text-sm text-earth-ink">{resource.printNote}</p>
                <p className="mt-4 text-sm text-earth-ink">Compiled by GrowGuide UK. Follow the guidance for your crop, variety and local conditions.</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
