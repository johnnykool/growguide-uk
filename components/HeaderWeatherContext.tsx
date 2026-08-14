"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WeatherData } from "@/lib/types";

interface HeaderWeatherSummary {
  postcode: string;
  temp?: number;
  description?: string;
}

interface HeaderWeatherContextValue {
  summary: HeaderWeatherSummary | null;
  setSummary: (summary: HeaderWeatherSummary | null) => void;
}

const HeaderWeatherContext = createContext<HeaderWeatherContextValue>({
  summary: null,
  setSummary: () => undefined,
});

export function HeaderWeatherProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<HeaderWeatherSummary | null>(null);
  const value = useMemo(() => ({ summary, setSummary }), [summary]);

  return (
    <HeaderWeatherContext.Provider value={value}>
      {children}
    </HeaderWeatherContext.Provider>
  );
}

export function useHeaderWeatherSummary() {
  return useContext(HeaderWeatherContext).summary;
}

export function usePublishHeaderWeather(
  postcode: string,
  weather: WeatherData | null,
) {
  const { setSummary } = useContext(HeaderWeatherContext);
  const temp = weather?.current.temp;
  const description = weather?.current.description;

  useEffect(() => {
    setSummary({ postcode, temp, description });
  }, [description, postcode, setSummary, temp]);

  useEffect(
    () => () => {
      setSummary(null);
    },
    [setSummary],
  );
}
