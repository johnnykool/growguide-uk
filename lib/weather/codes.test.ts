import { describe, expect, it } from "vitest";
import { describeWeatherCode, UNKNOWN_WEATHER } from "./codes";

describe("describeWeatherCode", () => {
  it("maps a day code to a day icon", () => {
    expect(describeWeatherCode(1)).toEqual({ description: "sunny", icon: "01d" });
  });

  it("maps a night code to a night icon", () => {
    expect(describeWeatherCode(0)).toEqual({ description: "clear night", icon: "01n" });
  });

  it("distinguishes the day and night variants of one condition", () => {
    expect(describeWeatherCode(9).icon).toBe("09n");
    expect(describeWeatherCode(10).icon).toBe("09d");
  });

  it("returns the fallback for code 4, which the Met Office does not use", () => {
    expect(describeWeatherCode(4)).toEqual(UNKNOWN_WEATHER);
  });

  it("returns the fallback for an out-of-range code", () => {
    expect(describeWeatherCode(99)).toEqual(UNKNOWN_WEATHER);
  });

  it("returns the fallback for a missing code", () => {
    expect(describeWeatherCode(undefined)).toEqual(UNKNOWN_WEATHER);
  });

  it("defines every code from 0 to 30 except 4", () => {
    const missing: number[] = [];
    for (let code = 0; code <= 30; code += 1) {
      if (code === 4) continue;
      if (describeWeatherCode(code) === UNKNOWN_WEATHER) missing.push(code);
    }
    expect(missing).toEqual([]);
  });

  it("only emits icon codes WeatherBanner can render", () => {
    const renderable = new Set(["01", "02", "03", "04", "09", "10", "11", "13", "50"]);
    for (let code = 0; code <= 30; code += 1) {
      const { icon } = describeWeatherCode(code);
      expect(renderable.has(icon.slice(0, 2))).toBe(true);
      expect(["d", "n"]).toContain(icon.slice(2));
    }
  });
});
