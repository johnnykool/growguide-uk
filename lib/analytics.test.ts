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
