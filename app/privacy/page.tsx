import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PRIVACY_TITLE = `Privacy | ${SITE_NAME}`;
const PRIVACY_DESCRIPTION = `How ${SITE_NAME} handles analytics and gardening data.`;

export const metadata: Metadata = {
  title: PRIVACY_TITLE,
  description: PRIVACY_DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${SITE_URL}/privacy`,
    siteName: SITE_NAME,
    title: PRIVACY_TITLE,
    description: PRIVACY_DESCRIPTION,
    images: [
      {
        url: "/brand/growguide-social.png",
        width: 1200,
        height: 630,
        alt: "Weather paths flow into GrowGuide UK actions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRIVACY_TITLE,
    description: PRIVACY_DESCRIPTION,
    images: ["/brand/growguide-social.png"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="w-full bg-pale-mineral px-4 py-10 text-garden-ground sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
      <header className="border-b border-garden-ground/30 pb-7">
      <h1 className="text-4xl font-semibold tracking-[-0.03em] text-garden-ground sm:text-5xl">Privacy</h1>
      <p className="mt-3 max-w-[70ch] text-base text-garden-ground/75">
        GrowGuide keeps data collection small and the gardening tools useful.
      </p>
      </header>

      <div className="mt-8 divide-y divide-garden-ground/25 border-y border-garden-ground/25">
        <section aria-labelledby="anonymous-visits" className="grid gap-2 py-6 md:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] md:gap-8">
          <h2 id="anonymous-visits" className="text-2xl font-semibold text-garden-ground">
            Anonymous visits
          </h2>
          <p className="max-w-[70ch] text-base text-garden-ground/80">
            We use anonymous, cookieless Vercel Web Analytics to understand
            aggregate visits and which pages are useful.
          </p>
        </section>

        <section aria-labelledby="saved-device" className="grid gap-2 py-6 md:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] md:gap-8">
          <h2 id="saved-device" className="text-2xl font-semibold text-garden-ground">
            Saved on your device
          </h2>
          <p className="max-w-[70ch] text-base text-garden-ground/80">
            Your setup, garden profile, saved advice, and completed tasks stay
            in this browser.
          </p>
        </section>

        <section aria-labelledby="advice-data" className="grid gap-2 py-6 md:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] md:gap-8">
          <h2 id="advice-data" className="text-2xl font-semibold text-garden-ground">
            Location, weather, and growing advice
          </h2>
          <div className="max-w-[70ch] space-y-3 text-base text-garden-ground/80">
          <p>
            Postcode validation sends the exact postcode you enter to
            api.postcodes.io to obtain a region and coordinates. Weather lookup
            sends those coordinates to OpenWeatherMap.
          </p>
          <p>
            Anthropic receives bounded region, garden, and derived-weather
            context when you ask for growing advice. It does not receive your
            exact postcode or coordinates.
          </p>
          </div>
        </section>

        <section aria-labelledby="your-choice" className="grid gap-2 py-6 md:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] md:gap-8">
          <h2 id="your-choice" className="text-2xl font-semibold text-garden-ground">
            Your choice
          </h2>
          <p className="max-w-[70ch] text-base text-garden-ground/80">
            You can block analytics without losing GrowGuide features.
            GrowGuide creates no user accounts, sells no data, and runs no
            advertising trackers.
          </p>
        </section>
      </div>
      </div>
    </main>
  );
}
