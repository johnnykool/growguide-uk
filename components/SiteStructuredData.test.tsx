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
