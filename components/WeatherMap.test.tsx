import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import WeatherMap from "./WeatherMap";

const leaflet = vi.hoisted(() => {
  const map = { remove: vi.fn() };
  const tile = {
    addTo: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  };
  const marker = {
    addTo: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
  };

  return { map, marker, tile };
});

vi.mock("leaflet", () => ({
  default: {
    map: vi.fn(() => leaflet.map),
    tileLayer: vi.fn(() => leaflet.tile),
    circleMarker: vi.fn(() => leaflet.marker),
  },
}));

afterEach(cleanup);

describe("WeatherMap", () => {
  it("keeps the secondary map reference compact", () => {
    render(<WeatherMap lat={51.4545} lng={-2.5879} postcode="BS1 5AH" />);

    const map = screen.getByLabelText("Weather map");
    expect(map).toHaveClass("h-48", "sm:h-52");
    expect(map).not.toHaveClass("h-64");
  });
});
