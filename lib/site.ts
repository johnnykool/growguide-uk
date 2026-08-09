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
