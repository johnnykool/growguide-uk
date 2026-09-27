"use client";

import Image from "next/image";
import Link from "next/link";
import { DownloadSimple } from "@phosphor-icons/react";
import { RESOURCES } from "@/data/resources";
import { ICON_WEIGHT } from "@/lib/icons";
import { HERO_BASKET } from "@/lib/images";
import ResourcePreview from "@/components/ResourcePreview";

export default function ResourceLibrary({ resourceId }: { resourceId?: string }) {
  const selected = RESOURCES.find((resource) => resource.id === resourceId) ?? RESOURCES[0];
  return (
    <main>
      <section className="relative h-56 sm:h-72">
        <Image
          src={HERO_BASKET}
          alt="A hand holding a wooden basket piled with freshly picked home-grown vegetables"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-earth/80 via-dark-earth/30 to-transparent" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-5 sm:px-8">
            <h1 className="font-serif text-3xl text-cream sm:text-4xl">Resources</h1>
            <p className="max-w-2xl text-sm font-medium text-cream sm:text-base">
              A little guidance to keep beside your seed packets.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-12">
        <p className="max-w-2xl text-lg text-earth-ink">Browse our free printables, take a closer look, and find something useful for your patch.</p>

        <div role="group" aria-label="Choose a resource" className="mt-8 flex flex-wrap gap-2">
          {RESOURCES.map((resource) => <Link key={resource.id} href={`/resources/${resource.id}`} scroll={false} aria-current={resourceId === resource.id ? "page" : undefined} className={`min-h-11 rounded-btn border border-dark-earth px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth ${selected.id === resource.id ? "bg-dark-earth text-cream" : "hover:bg-light-sage/40"}`}>{resource.subtitle}</Link>)}
        </div>
        <div className="mt-7">
          {[selected].map((resource) => (
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
      </div>
    </main>
  );
}
