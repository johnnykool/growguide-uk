import type { WeatherData } from "@/lib/types";

type WeatherActionCueKind = "rain" | "frost";

interface WeatherActionCueData {
  kind: WeatherActionCueKind;
  text: string;
}

interface Props {
  weather: WeatherData | null;
  id?: string;
}

export function getWeatherActionCue(
  weather: WeatherData | null,
): WeatherActionCueData | null {
  if (weather?.warnings.frostSoon) {
    return {
      kind: "frost",
      text: "Frost risk — protect tender crops before temperatures drop.",
    };
  }

  if (weather?.warnings.rainSoon) {
    return {
      kind: "rain",
      text: "Rain ahead — check the soil before watering.",
    };
  }

  return null;
}

export default function WeatherActionCue({ weather, id }: Props) {
  const cue = getWeatherActionCue(weather);

  if (!cue) {
    return null;
  }

  return (
    <aside
      id={id}
      role="note"
      aria-label="Weather-linked action"
      className="border-t border-[#7DB8E6] pt-3 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0"
    >
      <span
        aria-hidden="true"
        className={`mt-1 block h-2 w-2 rounded-full ${
          cue.kind === "frost" ? "bg-[#E0645B]" : "bg-[#7DB8E6]"
        }`}
      />
      <p className="mt-2 text-sm font-semibold text-[#20312C]">{cue.text}</p>
    </aside>
  );
}
