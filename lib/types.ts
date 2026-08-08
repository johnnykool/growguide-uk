export interface Vegetable {
  id: string;
  name: string;
  category: string;
  emoji: string;
  sowIndoors: number[]; // month numbers 1-12
  sowOutdoors: number[];
  transplant: number[];
  harvest: number[];
  pests: string[];
  diseases: string[];
  pruningCare: string;
  spacing: string;
  difficulty: "Easy" | "Medium" | "Hard";
  notes: string; // UK-specific tips
}

export type PlotSize = "windowsill" | "small" | "medium" | "large";

export interface UserProfile {
  postcode: string;
  lat: number;
  lng: number;
  region: string;
  vegetables: string[];
  plotSize: PlotSize;
  environment: string[];
  equipment: string[];
  lastUpdated: string;
}

export interface SetupDraftV1 {
  version: 1;
  activeStep: 1 | 2 | 3 | 4;
  postcode: string;
  lookup: {
    lat: number;
    lng: number;
    region: string;
    postcode: string;
  } | null;
  vegetables: string[];
  plotSize: PlotSize;
  environment: string[];
  equipment: string[];
  showAllCrops: boolean;
  showAllEquipment: boolean;
}

export interface DailySummary {
  date: string; // ISO date
  dayName: string; // e.g. "Tue"
  high: number;
  low: number;
  conditions: string;
  icon: string; // OpenWeatherMap icon code, e.g. "10d"
  rainProbability: number; // 0-100
}

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  daily: DailySummary[];
  warnings: {
    rainSoon: boolean; // rain forecast in next 48h
    frostSoon: boolean; // frost forecast in next 48h
  };
}

export type TaskPriority = "high" | "medium" | "low";

export type TaskCategory =
  | "sowing"
  | "planting"
  | "care"
  | "harvest"
  | "pest control"
  | "disease prevention"
  | "protection";

export interface AdviceTask {
  vegetable: string;
  priority: TaskPriority;
  category: TaskCategory;
  title: string;
  detail: string;
  weatherNote?: string;
}

export interface AdviceResponse {
  summary: string;
  weatherWarnings: string[];
  tasks: AdviceTask[];
}

export interface SavedAdvice {
  timeline: Timeline;
  generatedAt: string; // ISO date-time
  advice: AdviceResponse;
  completed: Record<string, boolean>; // task key → done
}

export type Timeline =
  | "24-hours"
  | "3-days"
  | "7-days"
  | "14-days"
  | "30-days"
  | "3-months";

export const TIMELINE_LABELS: Record<Timeline, string> = {
  "24-hours": "Next 24 hours",
  "3-days": "Next 3 days",
  "7-days": "Next 7 days",
  "14-days": "Next 14 days",
  "30-days": "Next 30 days",
  "3-months": "Next 3 months",
};

export const PLOT_SIZE_LABELS: Record<PlotSize, string> = {
  windowsill: "Windowsill / containers",
  small: "Small raised bed (<4m²)",
  medium: "Medium plot (4–20m²)",
  large: "Large plot / allotment (20m²+)",
};

export const ENVIRONMENT_OPTIONS = [
  { id: "open-ground", label: "Open ground" },
  { id: "raised-beds", label: "Raised beds" },
  { id: "greenhouse", label: "Greenhouse" },
  { id: "polytunnel", label: "Polytunnel" },
  { id: "containers", label: "Containers" },
] as const;

export const EQUIPMENT_OPTIONS = [
  { id: "spade", label: "Spade" },
  { id: "fork", label: "Fork" },
  { id: "hoe", label: "Hoe" },
  { id: "rake", label: "Rake" },
  { id: "trowel", label: "Trowel" },
  { id: "secateurs", label: "Secateurs" },
  { id: "watering-can", label: "Watering can" },
  { id: "hose-irrigation", label: "Hose / irrigation" },
  { id: "wheelbarrow", label: "Wheelbarrow" },
  { id: "cold-frame", label: "Cold frame" },
  { id: "cloche", label: "Cloche" },
  { id: "fleece-netting", label: "Fleece / netting" },
  { id: "seed-trays", label: "Seed trays" },
  { id: "propagator", label: "Propagator" },
  { id: "compost-bin", label: "Compost bin" },
  { id: "greenhouse", label: "Greenhouse" },
  { id: "polytunnel", label: "Polytunnel" },
] as const;
