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
