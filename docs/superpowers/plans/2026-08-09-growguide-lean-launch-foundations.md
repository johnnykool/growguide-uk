# GrowGuide Lean Launch Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare GrowGuide for `growguideuk.co.uk` with anonymous Vercel Analytics, concise privacy disclosure, canonical search metadata, crawlable public routes, and social sharing metadata without optional tracking or empty social accounts.

**Architecture:** A client-only analytics wrapper owns Vercel's `beforeSend` boundary, while a small site-identity module provides one canonical origin to metadata, robots, sitemap, and structured data. A static privacy page discloses the data flow, and a launch runbook separates code deployment from Hostinger, Vercel, and Search Console actions.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, `@vercel/analytics` 2, Vitest, Testing Library, Vercel, Hostinger DNS, Google Search Console

## Global Constraints

- The sole canonical origin is `https://growguideuk.co.uk`.
- Use Vercel Web Analytics and Google Search Console only.
- Do not initialise Google Analytics, Google Tag Manager, Microsoft Clarity, advertising pixels, session recordings, or individual-user profiling.
- Do not show an analytics consent banner.
- Remove the unused `@microsoft/clarity` dependency.
- Send no profile, postcode, coordinate, crop, garden, weather, AI-question, or generated-advice data to analytics.
- Analytics and search infrastructure must never call the weather API, Anthropic API, or an MCP service.
- Do not render social links until the exact account URLs are supplied.
- Preserve the Ko-fi URL `https://ko-fi.com/growguideuk` and its existing support copy.
- Preserve the current explicit-action and saved-advice protections for paid AI requests.

---

## File structure

- `lib/site.ts`: canonical site identity, public route list, and supported structured data.
- `lib/analytics.ts`: privacy boundary for Vercel page-view URLs.
- `components/SiteAnalytics.tsx`: client wrapper that mounts Vercel Analytics once.
- `components/SiteStructuredData.tsx`: safe JSON-LD renderer.
- `app/layout.tsx`: canonical metadata and global launch components.
- `app/robots.ts`: crawler policy and sitemap location.
- `app/sitemap.ts`: canonical indexable routes.
- `app/privacy/page.tsx`: concise public privacy disclosure.
- `components/Footer.tsx`: privacy navigation alongside the existing support link.
- `docs/launch/growguideuk-domain-search-console.md`: manual production rollout checklist.

### Task 1: Add the anonymous analytics boundary

**Files:**
- Create: `lib/site.ts`
- Create: `lib/analytics.ts`
- Create: `lib/analytics.test.ts`
- Create: `components/SiteAnalytics.tsx`
- Create: `components/SiteAnalytics.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `SITE_URL`
- Produces: `sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null`
- Produces: `SiteAnalytics(): JSX.Element`
- Consumes: `Analytics`, `BeforeSendEvent`, and `BeforeSend` from `@vercel/analytics/next`

- [ ] **Step 1: Write the failing analytics sanitisation tests**

Create `lib/analytics.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sanitizeAnalyticsEvent } from "./analytics";

describe("sanitizeAnalyticsEvent", () => {
  it("keeps only the canonical origin and pathname", () => {
    expect(
      sanitizeAnalyticsEvent({
        type: "pageview",
        url: "https://preview.example/?postcode=SW1A%201AA#results",
      }),
    ).toEqual({ type: "pageview", url: "https://growguideuk.co.uk/" });
  });

  it("drops malformed event URLs instead of leaking them", () => {
    expect(
      sanitizeAnalyticsEvent({ type: "pageview", url: "http://[invalid" }),
    ).toBeNull();
  });
});
```

- [ ] **Step 2: Run the sanitisation test and verify RED**

Run:

```bash
npm test -- lib/analytics.test.ts --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because `lib/analytics.ts` does not exist.

- [ ] **Step 3: Implement the minimal privacy boundary**

Create `lib/site.ts`:

```ts
export const SITE_URL = "https://growguideuk.co.uk";
```

Create `lib/analytics.ts`:

```ts
import type { BeforeSend, BeforeSendEvent } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";

export const sanitizeAnalyticsEvent: BeforeSend = (
  event: BeforeSendEvent,
): BeforeSendEvent | null => {
  try {
    const source = new URL(event.url, SITE_URL);
    return { ...event, url: `${SITE_URL}${source.pathname}` };
  } catch {
    return null;
  }
};
```

- [ ] **Step 4: Run the sanitisation test and verify GREEN**

Run:

```bash
npm test -- lib/analytics.test.ts --maxWorkers=1 --minWorkers=1
```

Expected: 2 tests pass.

- [ ] **Step 5: Write the failing analytics wrapper test**

Create `components/SiteAnalytics.test.tsx` with a hoisted capture for the `beforeSend` property:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BeforeSend } from "@vercel/analytics/next";
import SiteAnalytics from "./SiteAnalytics";

const analyticsCapture = vi.hoisted(() => ({
  beforeSend: undefined as BeforeSend | undefined,
}));

vi.mock("@vercel/analytics/next", () => ({
  Analytics: ({ beforeSend }: { beforeSend?: BeforeSend }) => {
    analyticsCapture.beforeSend = beforeSend;
    return null;
  },
}));

describe("SiteAnalytics", () => {
  it("mounts Vercel Analytics with the privacy boundary", () => {
    render(<SiteAnalytics />);
    expect(analyticsCapture.beforeSend).toBeTypeOf("function");
    expect(
      analyticsCapture.beforeSend?.({
        type: "pageview",
        url: "https://growguideuk.co.uk/?postcode=secret",
      }),
    ).toEqual({ type: "pageview", url: "https://growguideuk.co.uk/" });
  });
});
```

- [ ] **Step 6: Run the wrapper test and verify RED**

Run:

```bash
npm test -- components/SiteAnalytics.test.tsx --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because `components/SiteAnalytics.tsx` does not exist.

- [ ] **Step 7: Implement and mount the wrapper**

Create `components/SiteAnalytics.tsx`:

```tsx
"use client";

import { Analytics } from "@vercel/analytics/next";
import { sanitizeAnalyticsEvent } from "@/lib/analytics";

export default function SiteAnalytics() {
  return <Analytics beforeSend={sanitizeAnalyticsEvent} />;
}
```

Import `SiteAnalytics` in `app/layout.tsx` and render `<SiteAnalytics />` immediately before `</body>`.

- [ ] **Step 8: Remove Microsoft Clarity from the dependency tree**

Run:

```bash
npm uninstall @microsoft/clarity
```

Expected: `package.json` and `package-lock.json` no longer contain `@microsoft/clarity`.

- [ ] **Step 9: Verify Task 1**

Run:

```bash
npm test -- lib/analytics.test.ts components/SiteAnalytics.test.tsx --maxWorkers=1 --minWorkers=1
npx tsc --noEmit
```

Expected: 3 tests pass and TypeScript exits 0.

- [ ] **Step 10: Commit Task 1**

```bash
git add app/layout.tsx components/SiteAnalytics.tsx components/SiteAnalytics.test.tsx lib/site.ts lib/analytics.ts lib/analytics.test.ts package.json package-lock.json
git commit -m "feat: add privacy-focused GrowGuide analytics"
```

### Task 2: Establish canonical metadata and crawlable routes

**Files:**
- Modify: `lib/site.ts`
- Create: `lib/site.test.ts`
- Create: `components/SiteStructuredData.tsx`
- Create: `components/SiteStructuredData.test.tsx`
- Create: `app/robots.ts`
- Create: `app/robots.test.ts`
- Create: `app/sitemap.ts`
- Create: `app/sitemap.test.ts`
- Create: `app/layout.test.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`, `PUBLIC_ROUTES`, and `SITE_STRUCTURED_DATA`
- Produces: `SiteStructuredData(): JSX.Element`
- Consumes: `Metadata`, `MetadataRoute.Robots`, and `MetadataRoute.Sitemap` from Next.js

- [ ] **Step 1: Write the failing site-identity tests**

Create `lib/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  PUBLIC_ROUTES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_STRUCTURED_DATA,
  SITE_URL,
} from "./site";

describe("site identity", () => {
  it("uses the purchased domain as the only canonical origin", () => {
    expect(SITE_URL).toBe("https://growguideuk.co.uk");
    expect(SITE_NAME).toBe("GrowGuide UK");
    expect(SITE_DESCRIPTION).toMatch(/UK gardeners/i);
    expect(PUBLIC_ROUTES).toEqual(["/", "/privacy"]);
  });

  it("describes a free web application without unsupported claims", () => {
    expect(SITE_STRUCTURED_DATA).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "GrowGuide UK",
      url: "https://growguideuk.co.uk",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    });
    expect(SITE_STRUCTURED_DATA).not.toHaveProperty("aggregateRating");
  });
});
```

- [ ] **Step 2: Run the site-identity tests and verify RED**

Run:

```bash
npm test -- lib/site.test.ts --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because `lib/site.ts` does not yet export the complete site identity.

- [ ] **Step 3: Implement the canonical site identity**

Create `lib/site.ts`:

```ts
export const SITE_URL = "https://growguideuk.co.uk";
export const SITE_NAME = "GrowGuide UK";
export const SITE_DESCRIPTION =
  "A vegetable planner and growing guide for UK gardeners, with weather-aware advice for your plot.";

export const PUBLIC_ROUTES = ["/", "/privacy"] as const;

export const SITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
} as const;
```

Do not add social handles, ratings, audience totals, awards, or endorsements.

- [ ] **Step 4: Run the site-identity tests and verify GREEN**

Run:

```bash
npm test -- lib/site.test.ts --maxWorkers=1 --minWorkers=1
```

Expected: 2 tests pass.

- [ ] **Step 5: Write failing robots and sitemap tests**

Create `app/robots.test.ts` and `app/sitemap.test.ts` that call the exported route functions directly:

```ts
import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows crawling and advertises the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: "https://growguideuk.co.uk/sitemap.xml",
      host: "https://growguideuk.co.uk",
    });
  });
});
```

```ts
import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("contains only canonical public pages", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://growguideuk.co.uk/",
      "https://growguideuk.co.uk/privacy",
    ]);
    expect(JSON.stringify(sitemap())).not.toContain("/api/");
    expect(JSON.stringify(sitemap())).not.toContain("vercel.app");
  });
});
```

- [ ] **Step 6: Run route tests and verify RED**

Run:

```bash
npm test -- app/robots.test.ts app/sitemap.test.ts --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because the route modules do not exist.

- [ ] **Step 7: Implement robots and sitemap routes**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`,
  }));
}
```

- [ ] **Step 8: Test the root metadata contract before changing it**

Create `app/layout.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  DM_Sans: () => ({ variable: "font-sans" }),
  DM_Serif_Display: () => ({ variable: "font-serif" }),
}));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SiteAnalytics", () => ({ default: () => null }));
vi.mock("@/components/SiteStructuredData", () => ({ default: () => null }));

import { metadata } from "./layout";

describe("root metadata", () => {
  it("publishes one canonical search and sharing identity", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://growguideuk.co.uk/");
    expect(metadata.alternates).toEqual({ canonical: "/" });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_GB",
      url: "https://growguideuk.co.uk",
      siteName: "GrowGuide UK",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(JSON.stringify(metadata)).not.toMatch(
      /google-analytics|googletagmanager|clarity/i,
    );
  });
});
```

Run:

```bash
npm test -- app/layout.test.tsx --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because the current metadata has no canonical, Open Graph, or Twitter configuration.

- [ ] **Step 9: Add canonical and social-sharing metadata**

Update `app/layout.tsx` to import the site constants and define:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/growguide-kofi-logo.png"],
  },
};
```

Do not add a Twitter handle or Google verification meta tag.

- [ ] **Step 10: Write and verify the structured-data RED/GREEN cycle**

Create `components/SiteStructuredData.test.tsx` first:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SITE_STRUCTURED_DATA } from "@/lib/site";
import SiteStructuredData from "./SiteStructuredData";

describe("SiteStructuredData", () => {
  it("renders only the supported public site claims", () => {
    const { container } = render(<SiteStructuredData />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).not.toBeNull();
    expect(JSON.parse(script?.textContent ?? "")).toEqual(SITE_STRUCTURED_DATA);
  });
});
```

Verify the test fails because the component is absent.

Then create `components/SiteStructuredData.tsx`:

```tsx
import { SITE_STRUCTURED_DATA } from "@/lib/site";

export default function SiteStructuredData() {
  const json = JSON.stringify(SITE_STRUCTURED_DATA).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
```

Render `<SiteStructuredData />` in the root layout's `<body>` before the visible shell.

- [ ] **Step 11: Verify Task 2**

Run:

```bash
npm test -- lib/site.test.ts app/robots.test.ts app/sitemap.test.ts app/layout.test.tsx components/SiteStructuredData.test.tsx --maxWorkers=1 --minWorkers=1
npx tsc --noEmit
```

Expected: all Task 2 tests pass and TypeScript exits 0.

- [ ] **Step 12: Commit Task 2**

```bash
git add app/layout.tsx app/layout.test.tsx app/robots.ts app/robots.test.ts app/sitemap.ts app/sitemap.test.ts components/SiteStructuredData.tsx components/SiteStructuredData.test.tsx lib/site.ts lib/site.test.ts
git commit -m "feat: establish GrowGuide search identity"
```

### Task 3: Add concise privacy disclosure and footer navigation

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/privacy/page.test.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/ShellContent.test.tsx`

**Interfaces:**
- Produces: the public `/privacy` route and its route metadata
- Consumes: `SITE_NAME` from `lib/site.ts`
- Preserves: Ko-fi link, support copy, credits, and absence of unconfigured social links

- [ ] **Step 1: Write the failing privacy-page test**

Create `app/privacy/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage, { metadata } from "./page";

describe("PrivacyPage", () => {
  it("explains the lean data flow in plain language", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { name: "Privacy" })).toBeVisible();
    expect(screen.getByText(/anonymous, cookieless Vercel Web Analytics/i)).toBeVisible();
    expect(screen.getByText(/stay in this browser/i)).toBeVisible();
    expect(screen.getByText(/exact postcode and coordinates are not included/i)).toBeVisible();
    expect(screen.getByText(/do not use advertising trackers/i)).toBeVisible();
    expect(screen.queryByText(/accept cookies/i)).not.toBeInTheDocument();
  });

  it("has canonical privacy metadata", () => {
    expect(metadata.alternates).toEqual({ canonical: "/privacy" });
  });
});
```

- [ ] **Step 2: Run the privacy-page test and verify RED**

Run:

```bash
npm test -- app/privacy/page.test.tsx --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because the privacy route does not exist.

- [ ] **Step 3: Implement the concise privacy page**

Create `app/privacy/page.tsx`:

```tsx
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
```

Keep this to one `h1` and four short sections. Do not add a popup, consent banner, decorative cards, or extra operational copy.

- [ ] **Step 4: Add the privacy footer contract before production markup**

Extend `components/ShellContent.test.tsx` to assert:

```ts
expect(within(footer).getByRole("link", { name: "Privacy" })).toHaveAttribute(
  "href",
  "/privacy",
);
```

Run:

```bash
npm test -- components/ShellContent.test.tsx --maxWorkers=1 --minWorkers=1
```

Expected: FAIL because the footer does not contain the privacy link.

- [ ] **Step 5: Add the minimal privacy link**

Import `Link` from `next/link` in `components/Footer.tsx`, then add this link beside the existing credits/support area:

```tsx
<Link
  href="/privacy"
  className="inline-flex min-h-11 items-center py-3 font-semibold text-cream underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
>
  Privacy
</Link>
```

Keep the existing Ko-fi destination, support copy, credits, external-link attributes, and social-link absence unchanged.

- [ ] **Step 6: Run the focused privacy tests and verify GREEN**

Run:

```bash
npm test -- app/privacy/page.test.tsx components/ShellContent.test.tsx --maxWorkers=1 --minWorkers=1
```

Expected: all focused privacy and footer tests pass.

- [ ] **Step 7: Run the required Impeccable checks once**

Load the Impeccable context for `app/privacy/page.tsx`, read the `polish` playbook and craft floor, then run the detector once against `app/privacy/page.tsx` and `components/Footer.tsx`. Resolve any finding in one bounded patch and do not rescan `components/Footer.tsx` if it was already scanned in this session.

- [ ] **Step 8: Verify and commit Task 3**

Run:

```bash
npm test -- app/privacy/page.test.tsx components/ShellContent.test.tsx --maxWorkers=1 --minWorkers=1
npx tsc --noEmit
```

Then commit:

```bash
git add app/privacy/page.tsx app/privacy/page.test.tsx components/Footer.tsx components/ShellContent.test.tsx
git commit -m "feat: publish concise GrowGuide privacy details"
```

### Task 4: Document and verify the production rollout

**Files:**
- Create: `docs/launch/growguideuk-domain-search-console.md`
- Modify only if verification exposes a defect: files already listed in Tasks 1-3

**Interfaces:**
- Consumes: production branch deployment, Vercel project domain settings, Hostinger DNS, and Google Search Console domain-property verification
- Produces: an exact manual rollout sequence that never points the purchased domain at a preview branch

- [ ] **Step 1: Write the rollout document**

Create `docs/launch/growguideuk-domain-search-console.md` with these ordered actions:

1. Confirm the implementation branch is approved and merged to the production branch.
2. Add `growguideuk.co.uk` and `www.growguideuk.co.uk` in Vercel Project Settings → Domains.
3. Copy the exact apex A and `www` CNAME values Vercel shows.
4. In Hostinger hPanel → Domains → `growguideuk.co.uk` → DNS / Nameservers, remove only conflicting apex A/AAAA and `www` A/CNAME records; preserve MX and unrelated TXT records.
5. Add Vercel's displayed records and wait for Vercel to show Valid Configuration and an active TLS certificate.
6. Configure a permanent Vercel redirect from `www.growguideuk.co.uk` to `https://growguideuk.co.uk`.
7. Create a Google Search Console Domain property for `growguideuk.co.uk`.
8. Add Google's displayed TXT verification value in Hostinger, leaving the record name at the apex value Hostinger requests.
9. Verify the property, then submit `https://growguideuk.co.uk/sitemap.xml`.
10. Check the canonical URL, robots file, sitemap, privacy page, and Ko-fi link on production.

State that DNS propagation can take time and that no A, CNAME, TXT, or redirect value should be guessed when Vercel or Google displays a project-specific value.

- [ ] **Step 2: Run the complete automated verification**

Run sequentially:

```bash
npm test -- --maxWorkers=1 --minWorkers=1
npx tsc --noEmit
npm run build
git diff --check
```

Expected: the full suite, TypeScript, production build, and whitespace check all pass.

- [ ] **Step 3: Run privacy, branding, and operating-cost scans**

Run:

```bash
git grep -niE 'google-analytics|googletagmanager|gtag\(|microsoft/clarity|clarity\.ms' -- app components lib package.json package-lock.json
git grep -ni 'crystal''pocket'
git grep -n 'https://ko-fi.com/growguideuk\|Support GrowGuide\|Help cover weather and AI costs.' -- components/Footer.tsx components/ShellContent.test.tsx
```

Expected:

- the forbidden analytics scan exits 1 with no matches;
- the former-brand scan exits 1 with no matches;
- the Ko-fi scan finds the approved URL and copy in the footer contract.

- [ ] **Step 4: Inspect the production diff**

Run:

```bash
git status --short
git diff --stat HEAD~3..HEAD
git diff --check HEAD~3..HEAD
```

Confirm the diff contains no social placeholders, consent banner, automatic advice call, analytics custom event, or unrequested application refactor.

- [ ] **Step 5: Commit the rollout document**

```bash
git add docs/launch/growguideuk-domain-search-console.md
git commit -m "docs: add GrowGuide production domain rollout"
```

- [ ] **Step 6: Request final branch review before pushing**

Use the requesting-code-review workflow against the complete implementation range. Fix only confirmed findings within this plan, rerun the affected tests, and complete the verification-before-completion workflow before pushing the existing branch and refreshing its Vercel preview.

## External values and actions

The code implementation requires no analytics project ID, tracking token, social handle, or DNS value.

After merge, the user or an authorised browser session must supply or approve:

- the A and CNAME values shown by the GrowGuide Vercel project;
- the Google Search Console TXT verification value;
- any future social account URL before a visible link is added.

No external account will be created, no DNS record will be changed, and no Search Console property will be submitted during code implementation without the user's action-specific authority.
