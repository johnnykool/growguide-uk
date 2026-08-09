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
