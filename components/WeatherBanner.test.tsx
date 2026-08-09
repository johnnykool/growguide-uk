import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import WeatherBanner from "./WeatherBanner";

afterEach(cleanup);

describe("WeatherBanner", () => {
  it("announces loading through a polite status region", () => {
    render(
      <WeatherBanner
        weather={null}
        loading
        error={null}
        onRetry={vi.fn()}
      />,
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Reading the sky over your plot…");
  });

  it("offers one retry without exposing the route error", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <WeatherBanner
        weather={null}
        loading={false}
        error="upstream returned 503"
        onRetry={onRetry}
      />,
    );

    expect(
      screen.getByText(
        "We can't load local weather right now. You can still get growing advice.",
      ),
    ).toBeVisible();
    expect(screen.queryByText(/503|upstream/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try weather again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
