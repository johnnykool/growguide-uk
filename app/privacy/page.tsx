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
        url: "/images/growguide-logo.jpg",
        width: 1024,
        height: 1024,
        alt: "GrowGuide UK logo: a serif G with a climbing vine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRIVACY_TITLE,
    description: PRIVACY_DESCRIPTION,
    images: ["/images/growguide-logo.jpg"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="font-serif text-4xl text-dark-earth">Privacy</h1>
      <p className="mt-3 text-earth-ink">
        GrowGuide keeps data collection small. There are no accounts, no
        cookie banner, and nothing to opt out of except analytics.
      </p>

      <div className="mt-8 space-y-7">
        <section aria-labelledby="saved-device">
          <h2 id="saved-device" className="font-serif text-2xl text-dark-earth">
            Saved on your device
          </h2>
          <p className="mt-2 text-earth-ink">
            Your setup, garden profile, saved advice, and completed tasks stay
            in this browser. Clearing your browser data removes them.
          </p>
        </section>

        <section aria-labelledby="what-leaves">
          <h2 id="what-leaves" className="font-serif text-2xl text-dark-earth">
            What leaves your browser
          </h2>
          <p className="mt-2 text-earth-ink">
            Postcode validation sends the exact postcode you enter to
            api.postcodes.io, which returns a region and coordinates. Those
            coordinates are rounded to about a kilometre before the forecast
            request goes to the Met Office, and map tiles are fetched through
            this site rather than by your browser, so OpenWeatherMap never sees
            you directly.
          </p>
          <p className="mt-2 text-earth-ink">
            Anthropic receives bounded region, garden, and derived-weather
            context when you ask for growing advice. It does not receive your
            exact postcode or coordinates.
          </p>
        </section>

        <section aria-labelledby="analytics">
          <h2 id="analytics" className="font-serif text-2xl text-dark-earth">
            Analytics and your choices
          </h2>
          <p className="mt-2 text-earth-ink">
            We use anonymous, cookieless Vercel Web Analytics to see which
            pages are useful. You can block it without losing any GrowGuide
            feature. GrowGuide creates no user accounts, sells no data, and
            runs no advertising trackers.
          </p>
        </section>
      </div>
    </main>
  );
}
