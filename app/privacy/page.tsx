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
        url: "/images/growguide-kofi-logo.png",
        width: 1254,
        height: 1254,
        alt: "GrowGuide UK seedling logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRIVACY_TITLE,
    description: PRIVACY_DESCRIPTION,
    images: ["/images/growguide-kofi-logo.png"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="font-serif text-4xl text-dark-earth">Privacy</h1>
      <p className="mt-3 text-earth-ink">
        GrowGuide keeps data collection small and the gardening tools useful.
      </p>

      <div className="mt-8 space-y-7">
        <section aria-labelledby="anonymous-visits">
          <h2 id="anonymous-visits" className="font-serif text-2xl text-dark-earth">
            Anonymous visits
          </h2>
          <p className="mt-2 text-earth-ink">
            We use anonymous, cookieless Vercel Web Analytics to understand
            aggregate visits and which pages are useful.
          </p>
        </section>

        <section aria-labelledby="saved-device">
          <h2 id="saved-device" className="font-serif text-2xl text-dark-earth">
            Saved on your device
          </h2>
          <p className="mt-2 text-earth-ink">
            Your setup, garden profile, saved advice, and completed tasks stay
            in this browser.
          </p>
        </section>

        <section aria-labelledby="advice-data">
          <h2 id="advice-data" className="font-serif text-2xl text-dark-earth">
            Location, weather, and growing advice
          </h2>
          <p className="mt-2 text-earth-ink">
            Postcode validation sends the exact postcode you enter to
            api.postcodes.io to obtain a region and coordinates. Weather lookup
            sends those coordinates to OpenWeatherMap.
          </p>
          <p className="mt-2 text-earth-ink">
            Anthropic receives bounded region, garden, and derived-weather
            context when you ask for growing advice. It does not receive your
            exact postcode or coordinates.
          </p>
        </section>

        <section aria-labelledby="your-choice">
          <h2 id="your-choice" className="font-serif text-2xl text-dark-earth">
            Your choice
          </h2>
          <p className="mt-2 text-earth-ink">
            You can block analytics without losing GrowGuide features.
            GrowGuide creates no user accounts, sells no data, and runs no
            advertising trackers.
          </p>
        </section>
      </div>
    </main>
  );
}
