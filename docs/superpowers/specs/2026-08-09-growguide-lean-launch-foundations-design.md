# GrowGuide Lean Launch Foundations Design

**Date:** 9 August 2026  
**Status:** Approved for implementation planning

## Goal

Launch GrowGuide on `https://growguideuk.co.uk` with enough anonymous measurement to understand traffic and search discovery, strong technical metadata, and no unnecessary visitor tracking or intrusive consent interface.

## Product decision

GrowGuide will use Vercel Web Analytics and Google Search Console only.

- Vercel Web Analytics provides anonymous, cookieless page, route, referrer, country, browser, and device totals.
- Google Search Console provides search queries, impressions, clicks, and ranking data through domain verification.
- Google Analytics, Google Tag Manager, Microsoft Clarity, advertising pixels, session recordings, and individual-user profiling will not run at launch.
- The site will not show an analytics consent banner because the launch stack does not set analytics cookies or load optional tracking scripts.
- The unused `@microsoft/clarity` dependency will be removed.

This is a deliberate data-minimisation decision. Clarity may be reconsidered later for a short, specific usability investigation, with a separate privacy review and consent design.

## Site origin and domain behaviour

The sole canonical origin is `https://growguideuk.co.uk`.

- `www.growguideuk.co.uk` will redirect permanently to `https://growguideuk.co.uk` in Vercel.
- The custom domain will point to the latest production deployment, not the preview branch.
- Hostinger will remain the DNS provider.
- Vercel will issue and renew the TLS certificate.
- Google Search Console will use a DNS TXT verification record supplied by Google and entered in Hostinger. No Google verification script will run in the application.

## Analytics architecture

The root layout will render `Analytics` from `@vercel/analytics/next` once for the application.

A `beforeSend` boundary will remove query strings and fragments before a page-view event leaves the browser. It will return only the canonical origin and pathname. This prevents accidental transmission of postcodes, tokens, or other values placed in URLs later.

The application will not emit custom analytics events at launch. It will never send profile fields, postcode values, coordinates, crop selections, garden details, weather payloads, AI questions, or generated advice to Vercel Analytics.

Analytics must fail open: blocking the analytics script or intake endpoint must not affect setup, weather, advice, storage, navigation, or rendering.

## Privacy disclosure

GrowGuide will add a concise `/privacy` page and a `Privacy` link in the footer. The page will state:

- Vercel Web Analytics collects anonymous aggregate traffic data without analytics cookies.
- Setup drafts, garden profiles, saved advice, and completed tasks remain in the visitor's browser storage.
- Weather lookup sends the minimum location data required to the weather service.
- A deliberate advice request sends bounded garden, region, and derived weather context to Anthropic; precise postcode and coordinates are excluded.
- GrowGuide does not sell visitor data, run advertising trackers, or create user accounts.
- Visitors can block analytics without losing any product function.

The privacy page will favour short headings and plain language. It will not create a popup or add text to the operational gardening flow.

## Technical search foundations

The root metadata will define:

- `metadataBase` as `https://growguideuk.co.uk`;
- a canonical URL for the home page;
- the approved product title and description;
- Open Graph metadata for a UK gardening web application;
- a large social sharing image derived from the approved GrowGuide identity;
- a Twitter/X summary card without requiring a GrowGuide account;
- `en_GB` locale information where supported.

The application will provide:

- `/robots.txt`, allowing normal crawling and pointing to the sitemap;
- `/sitemap.xml`, containing the canonical public routes;
- `WebApplication` JSON-LD describing a free UK gardening planner, without ratings, user counts, endorsements, or other unsupported claims.

The sitemap will include only real, indexable pages. API routes, preview hosts, setup states, and local-storage state will never appear.

## Social foundations

Social sharing metadata will work before any social account exists. Visible footer links will be added only after the corresponding account has been created and the exact public URL is supplied.

Initial channel priority is:

1. Instagram
2. Facebook
3. Pinterest

GrowGuide will not render empty icons, placeholder links, fabricated handles, or links to accounts it does not control. External account creation, posting, scheduling, and advertising remain outside this code change and require separate user-authorised actions.

## AI and operating-cost controls

Analytics and search infrastructure must never call the weather API, Anthropic API, or an MCP service.

The current paid-advice protections remain:

- no advice request on page load;
- saved advice is restored locally;
- fresh advice requires an explicit button action;
- replacing saved advice requires confirmation;
- request payloads and response token counts remain bounded;
- existing server-side rate limiting remains in place.

This launch work will not add background refreshes, prefetch paid advice, or create analytics-triggered API calls.

## Failure behaviour

- Vercel Analytics blocked or unavailable: the site continues without telemetry.
- Search Console not yet verified: the site remains crawlable and functional.
- Custom domain pending DNS: the existing Vercel URL remains available.
- Social accounts absent: no social links render.
- Metadata image unavailable: text metadata and the application remain functional.

## Verification

Implementation will add focused tests that prove:

- the root layout includes Vercel Analytics;
- analytics sanitisation removes query strings and fragments;
- no Google Analytics, Tag Manager, or Clarity initialisation exists;
- canonical, Open Graph, and Twitter metadata use `https://growguideuk.co.uk`;
- robots and sitemap output use the canonical origin and exclude API routes;
- the privacy page states the approved data practices;
- the footer links to the privacy page and contains no placeholder social links;
- existing advice and saved-state tests remain green.

Final verification will run the full test suite, TypeScript checking, a production build, and tracked-file scans for forbidden analytics initialisation and the former parent-brand references.

## Rollout order

1. Implement and verify the code changes on the existing feature branch.
2. Review the preview deployment without connecting the custom domain.
3. Merge the approved branch to production.
4. Add `growguideuk.co.uk` and `www.growguideuk.co.uk` to the Vercel project.
5. Enter Vercel's exact A and CNAME records in Hostinger.
6. Configure the permanent `www` redirect in Vercel.
7. Add the Google Search Console DNS TXT record in Hostinger.
8. Submit the production sitemap in Search Console after DNS and TLS are active.

## Non-goals

This launch unit does not add Google Analytics, Tag Manager, Microsoft Clarity, advertising, newsletters, user accounts, a database, a consent-management platform, social account automation, paid promotion, or changes to the gardening recommendation model.
