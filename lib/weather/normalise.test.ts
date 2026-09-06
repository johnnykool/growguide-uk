import { describe, expect, it } from "vitest";
import dailyFixture from "./__fixtures__/metoffice-daily.json";
import hourlyFixture from "./__fixtures__/metoffice-hourly.json";
import type {
  MetOfficeDailyEntry,
  MetOfficeForecast,
  MetOfficeHourlyEntry,
} from "./metoffice";
import { normaliseForecast } from "./normalise";

// Midday UTC on the day the fixtures were captured.
const NOW = Date.parse("2026-09-06T12:00:00Z");

function fromFixtures(): MetOfficeForecast {
  return {
    daily: dailyFixture.features[0].properties.timeSeries as MetOfficeDailyEntry[],
    hourly: hourlyFixture.features[0].properties.timeSeries as MetOfficeHourlyEntry[],
    modelRunDate: dailyFixture.features[0].properties.modelRunDate,
  };
}

function withHourly(hourly: MetOfficeHourlyEntry[]): MetOfficeForecast {
  return { ...fromFixtures(), hourly };
}

function hour(offsetHours: number, fields: Partial<MetOfficeHourlyEntry>): MetOfficeHourlyEntry {
  return {
    time: new Date(NOW + offsetHours * 3_600_000).toISOString(),
    screenTemperature: 12,
    minScreenAirTemp: 12,
    significantWeatherCode: 1,
    probOfPrecipitation: 0,
    ...fields,
  };
}

describe("normaliseForecast daily strip", () => {
  it("excludes the leading previous day", () => {
    const { daily } = normaliseForecast(fromFixtures(), NOW);
    expect(daily[0].date).toBe("2026-09-06");
    expect(daily.map((d) => d.date)).not.toContain("2026-09-05");
  });

  it("returns five days", () => {
    expect(normaliseForecast(fromFixtures(), NOW).daily).toHaveLength(5);
  });

  it("takes high and low from the day maximum and night minimum", () => {
    const [today] = normaliseForecast(fromFixtures(), NOW).daily;
    expect(today.high).toBe(26);
    expect(today.low).toBe(18);
  });

  it("names the day from the entry's own local date", () => {
    expect(normaliseForecast(fromFixtures(), NOW).daily[0].dayName).toBe("Sun");
  });

  it("takes rain probability as the greater of day and night", () => {
    const forecast = fromFixtures();
    forecast.daily = [
      { time: "2026-09-06T00:00Z", dayMaxScreenTemperature: 20, nightMinScreenTemperature: 10, dayProbabilityOfRain: 12, nightProbabilityOfRain: 47 },
    ];
    expect(normaliseForecast(forecast, NOW).daily[0].rainProbability).toBe(47);
  });

  it("drops a day with no maximum temperature rather than rendering a gap", () => {
    const forecast = fromFixtures();
    forecast.daily = [
      { time: "2026-09-06T00:00Z", nightMinScreenTemperature: 10 },
      { time: "2026-09-07T00:00Z", dayMaxScreenTemperature: 20, nightMinScreenTemperature: 10 },
    ];
    const { daily } = normaliseForecast(forecast, NOW);
    expect(daily).toHaveLength(1);
    expect(daily[0].date).toBe("2026-09-07");
  });

  it("describes the day from the daytime weather code", () => {
    const forecast = fromFixtures();
    forecast.daily = [
      { time: "2026-09-06T00:00Z", dayMaxScreenTemperature: 20, nightMinScreenTemperature: 10, daySignificantWeatherCode: 12 },
    ];
    expect(normaliseForecast(forecast, NOW).daily[0]).toMatchObject({
      conditions: "light rain",
      icon: "10d",
    });
  });
});

describe("normaliseForecast current reading", () => {
  it("uses the hourly entry nearest to now", () => {
    const forecast = withHourly([
      hour(-5, { screenTemperature: 5 }),
      hour(0.25, { screenTemperature: 17.4, significantWeatherCode: 7 }),
      hour(10, { screenTemperature: 30 }),
    ]);
    expect(normaliseForecast(forecast, NOW).current).toEqual({
      temp: 17,
      description: "cloudy",
      icon: "03d",
    });
  });

  it("carries the model run date through as observedAt", () => {
    expect(normaliseForecast(fromFixtures(), NOW).observedAt).toBe("2026-09-06T11:00Z");
  });
});

describe("normaliseForecast warnings", () => {
  it("warns of frost at exactly the threshold", () => {
    const forecast = withHourly([hour(6, { minScreenAirTemp: 3 })]);
    expect(normaliseForecast(forecast, NOW).warnings.frostSoon).toBe(true);
  });

  it("does not warn of frost just above the threshold", () => {
    const forecast = withHourly([hour(6, { minScreenAirTemp: 3.1 })]);
    expect(normaliseForecast(forecast, NOW).warnings.frostSoon).toBe(false);
  });

  it("warns of rain at exactly the threshold", () => {
    const forecast = withHourly([hour(6, { probOfPrecipitation: 50 })]);
    expect(normaliseForecast(forecast, NOW).warnings.rainSoon).toBe(true);
  });

  it("does not warn of rain just below the threshold", () => {
    const forecast = withHourly([hour(6, { probOfPrecipitation: 49 })]);
    expect(normaliseForecast(forecast, NOW).warnings.rainSoon).toBe(false);
  });

  it("ignores conditions beyond the 48 hour window", () => {
    const forecast = withHourly([hour(60, { minScreenAirTemp: -4, probOfPrecipitation: 95 })]);
    expect(normaliseForecast(forecast, NOW).warnings).toEqual({
      rainSoon: false,
      frostSoon: false,
    });
  });

  it("ignores conditions already in the past", () => {
    const forecast = withHourly([
      hour(-6, { minScreenAirTemp: -4, probOfPrecipitation: 95 }),
      hour(1, {}),
    ]);
    expect(normaliseForecast(forecast, NOW).warnings).toEqual({
      rainSoon: false,
      frostSoon: false,
    });
  });
});
