import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WeatherData } from "@/lib/types";
import WeatherActionCue, { getWeatherActionCue } from "./WeatherActionCue";

const base: WeatherData = {
  current: { temp: 12, description: "light rain", icon: "10d" },
  daily: [],
  warnings: { rainSoon: false, frostSoon: false },
};

describe("WeatherActionCue", () => {
  it("turns rain risk into one local watering action", () => {
    render(
      <WeatherActionCue
        weather={{ ...base, warnings: { rainSoon: true, frostSoon: false } }}
      />,
    );

    const cue = screen.getByRole("note", { name: "Weather-linked action" });
    expect(cue).toHaveTextContent(
      "Rain ahead — check the soil before watering.",
    );
    expect(cue).toHaveAttribute("data-weather-target", "rain");
    expect(cue).toHaveClass("weather-story-target");
    const flower = cue.querySelector("[data-black-flower='true']");
    expect(flower).toHaveAttribute("width", "32");
    expect(flower).toHaveAttribute("data-black-flower-bloom", "true");
  });

  it("prioritises frost when both warnings are present", () => {
    expect(
      getWeatherActionCue({
        ...base,
        warnings: { rainSoon: true, frostSoon: true },
      }),
    ).toEqual({
      kind: "frost",
      text: "Frost risk — protect tender crops before temperatures drop.",
    });
  });

  it("renders nothing without a warning", () => {
    const { container } = render(<WeatherActionCue weather={base} />);
    expect(container).toBeEmptyDOMElement();
  });
});
