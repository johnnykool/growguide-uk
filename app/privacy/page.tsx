import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy | ${SITE_NAME}`,
  description: `How ${SITE_NAME} handles analytics and gardening data.`,
  alternates: { canonical: "/privacy" },
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
            Your setup, garden profile, saved advice, and completed tasks stay in
            this browser.
          </p>
        </section>

        <section aria-labelledby="advice-data">
          <h2 id="advice-data" className="font-serif text-2xl text-dark-earth">
            Weather and growing advice
          </h2>
          <p className="mt-2 text-earth-ink">
            Weather lookup uses your location. When you ask for growing advice,
            bounded region, garden, and weather details are sent to Anthropic;
            your exact postcode and coordinates are not included.
          </p>
        </section>

        <section aria-labelledby="your-choice">
          <h2 id="your-choice" className="font-serif text-2xl text-dark-earth">
            Your choice
          </h2>
          <p className="mt-2 text-earth-ink">
            You can block analytics without losing GrowGuide features. We do not
            use advertising trackers or sell your data.
          </p>
        </section>
      </div>
    </main>
  );
}
