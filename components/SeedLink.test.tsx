import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "@vercel/analytics";
import SeedLink from "./SeedLink";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
afterEach(cleanup);
const retailer = { name: "Seed retailer", url: "https://example.com/seeds" };

describe("seed links", () => {
  it("opens the ordinary product link and counts the specific variety", () => {
    render(<SeedLink crop="tomatoes" variety="sungold-f1" name="Sungold F1" retailer={retailer} />);
    const link = screen.getByRole("link", { name: /View seeds at Seed retailer for Sungold F1/ });
    expect(link).toHaveAttribute("href", retailer.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("rel", expect.stringContaining("sponsored"));
    fireEvent.click(link);
    expect(track).toHaveBeenCalledWith("seed_link_click", { crop: "tomatoes", variety: "sungold-f1", retailer: "Seed retailer", affiliate: false });
  });

  it("labels configured affiliate links and marks them sponsored", () => {
    render(<SeedLink crop="tomatoes" variety="sungold-f1" name="Sungold F1" retailer={{ ...retailer, affiliateUrl: "https://example.com/approved-affiliate" }} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/approved-affiliate");
    expect(link).toHaveAttribute("rel", "sponsored noopener noreferrer");
    expect(link).toHaveTextContent("(affiliate)");
  });

  it("falls back safely if an affiliate URL is invalid", () => {
    render(<SeedLink crop="tomatoes" variety="sungold-f1" name="Sungold F1" retailer={{ ...retailer, affiliateUrl: "javascript:alert(1)" }} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", retailer.url);
    expect(screen.queryByText("(affiliate)")).not.toBeInTheDocument();
  });

  // The fallback is the path every non-affiliate retailer takes, so it is
  // screened on the same terms as the affiliate link rather than trusted.
  it.each([
    ["a javascript: URI", "javascript:alert(1)"],
    ["a plain-text scheme", "data:text/html,<script>alert(1)</script>"],
    ["an unparseable URL", "not-a-url"],
  ])("refuses to link an ordinary product page that is %s", (_label, url) => {
    render(<SeedLink crop="tomatoes" variety="sungold-f1" name="Sungold F1" retailer={{ name: "Seed retailer", url }} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });
});
