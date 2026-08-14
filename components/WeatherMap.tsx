"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
  postcode: string;
}

const OVERLAYS = [
  { id: "precipitation_new", label: "Rain" },
  { id: "clouds_new", label: "Cloud" },
  { id: "temp_new", label: "Temp" },
] as const;

type OverlayId = (typeof OVERLAYS)[number]["id"];

export default function WeatherMap({ lat, lng, postcode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const overlayRef = useRef<TileLayer | null>(null);
  const [overlay, setOverlay] = useState<OverlayId>("precipitation_new");
  const [ready, setReady] = useState(false);

  // Leaflet touches `window` on import, so load it client-side only.
  useEffect(() => {
    let disposed = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (disposed || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 8,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      L.circleMarker([lat, lng], {
        radius: 8,
        color: "#285F87",
        weight: 3,
        fillColor: "#7DB8E6",
        fillOpacity: 0.9,
      })
        .addTo(map)
        .bindPopup(`Your plot — ${postcode}`);

      mapRef.current = map;
      setReady(true);
    })();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      overlayRef.current = null;
    };
  }, [lat, lng, postcode]);

  // Swap the weather overlay when the toggle changes.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;
      overlayRef.current?.remove();
      overlayRef.current = L.tileLayer(
        `/api/weather-tiles/${overlay}/{z}/{x}/{y}`,
        { opacity: 0.75, maxZoom: 18 }
      ).addTo(mapRef.current);
    })();
    return () => {
      cancelled = true;
    };
  }, [overlay, ready]);

  return (
    <section className="overflow-hidden border border-garden-ground/30 bg-pale-mineral">
      <div className="flex flex-col gap-3 border-b border-garden-ground/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-garden-ground">Weather over your plot</h3>
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Map overlay">
          {OVERLAYS.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={overlay === o.id}
              onClick={() => setOverlay(o.id)}
              className={`min-h-11 border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral ${
                overlay === o.id
                  ? "border-rain-ink bg-rain-ink text-pale-mineral"
                  : "border-garden-ground/35 bg-pale-mineral text-garden-ground hover:bg-moss-veil/25"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="h-64 w-full" aria-label="Weather map" />
    </section>
  );
}
