"use client";

import { Analytics } from "@vercel/analytics/next";
import { sanitizeAnalyticsEvent } from "@/lib/analytics";

export default function SiteAnalytics() {
  return <Analytics beforeSend={sanitizeAnalyticsEvent} />;
}
