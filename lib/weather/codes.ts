export interface WeatherDescription {
  description: string;
  icon: string;
}

export const UNKNOWN_WEATHER: WeatherDescription = {
  description: "unknown",
  icon: "01d",
};

// Met Office significant weather codes. 4 is not used by the API.
// Icons reuse OpenWeatherMap's codes so WeatherBanner needs no change.
const WEATHER_CODES: Record<number, WeatherDescription> = {
  0: { description: "clear night", icon: "01n" },
  1: { description: "sunny", icon: "01d" },
  2: { description: "partly cloudy", icon: "02n" },
  3: { description: "partly cloudy", icon: "02d" },
  5: { description: "mist", icon: "50d" },
  6: { description: "fog", icon: "50d" },
  7: { description: "cloudy", icon: "03d" },
  8: { description: "overcast", icon: "04d" },
  9: { description: "light rain shower", icon: "09n" },
  10: { description: "light rain shower", icon: "09d" },
  11: { description: "drizzle", icon: "09d" },
  12: { description: "light rain", icon: "10d" },
  13: { description: "heavy rain shower", icon: "09n" },
  14: { description: "heavy rain shower", icon: "09d" },
  15: { description: "heavy rain", icon: "10d" },
  16: { description: "sleet shower", icon: "13n" },
  17: { description: "sleet shower", icon: "13d" },
  18: { description: "sleet", icon: "13d" },
  19: { description: "hail shower", icon: "13n" },
  20: { description: "hail shower", icon: "13d" },
  21: { description: "hail", icon: "13d" },
  22: { description: "light snow shower", icon: "13n" },
  23: { description: "light snow shower", icon: "13d" },
  24: { description: "light snow", icon: "13d" },
  25: { description: "heavy snow shower", icon: "13n" },
  26: { description: "heavy snow shower", icon: "13d" },
  27: { description: "heavy snow", icon: "13d" },
  28: { description: "thunder shower", icon: "11n" },
  29: { description: "thunder shower", icon: "11d" },
  30: { description: "thunder", icon: "11d" },
};

export function describeWeatherCode(
  code: number | undefined
): WeatherDescription {
  if (code === undefined) return UNKNOWN_WEATHER;
  return WEATHER_CODES[code] ?? UNKNOWN_WEATHER;
}
