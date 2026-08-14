import type { WeatherData } from "@/lib/types";
import BlackFlowerMark from "./BlackFlowerMark";

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
      data-weather-target={cue.kind}
      className="weather-story-target relative z-20 border-t border-sky-blue p-3 lg:border-l lg:border-t-0"
    >
      <div className="flex items-start gap-3">
        <BlackFlowerMark
          bloom
          className="h-8 w-8 shrink-0 text-black-flower"
        />
        <p className="pt-1 text-sm font-semibold text-garden-ground">
          {cue.text}
        </p>
      </div>
    </aside>
  );
}
