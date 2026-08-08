import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadSavedAdvice, saveAdvice } from "@/lib/storage";
import {
  AdviceResponse,
  SavedAdvice,
  UserProfile,
  WeatherData,
} from "@/lib/types";
import Dashboard from "./Dashboard";

vi.mock("./WeatherMap", () => ({
  default: () => null,
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

const profile: UserProfile = {
  postcode: "BS1 5AH",
  lat: 51.4545,
  lng: -2.5879,
  region: "South West England",
  vegetables: ["tomato"],
  plotSize: "small",
  environment: ["raised-beds"],
  equipment: ["trowel"],
  lastUpdated: "2026-08-08T09:00:00.000Z",
};

const savedAdvice: SavedAdvice = {
  timeline: "7-days",
  generatedAt: "2026-08-07T12:00:00.000Z",
  advice: {
    summary: "Keep tending the saved tomato plan.",
    weatherWarnings: [],
    tasks: [
      {
        vegetable: "Tomato",
        priority: "high",
        category: "care",
        title: "Water deeply",
        detail: "Water at the roots before the warm afternoon.",
      },
    ],
  },
  completed: { "Tomato|Water deeply": true },
};

const weather: WeatherData = {
  current: { temp: 19, description: "broken clouds", icon: "04d" },
  daily: [],
  warnings: { rainSoon: false, frostSoon: false },
};

const replacementAdvice: AdviceResponse = {
  summary: "Start the new tomato plan.",
  weatherWarnings: [],
  tasks: [
    {
      vegetable: "Tomato",
      priority: "medium",
      category: "care",
      title: "Tie in new growth",
      detail: "Support the newest stem with soft twine.",
    },
  ],
};

type FetchResult = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

function response(body: unknown, status = 200): FetchResult {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
}

function routeOf(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.pathname;
  return (input as Request).url;
}

function adviceRequestCount(fetchMock: ReturnType<typeof vi.fn>): number {
  return fetchMock.mock.calls.filter(([input]) => routeOf(input) === "/api/advice")
    .length;
}

function installFetch(adviceResult: FetchResult) {
  const fetchMock = vi.fn().mockImplementation((input: unknown) => {
    if (routeOf(input) === "/api/weather") {
      return Promise.resolve(response(weather));
    }
    if (routeOf(input) === "/api/advice") {
      return Promise.resolve(adviceResult);
    }
    return Promise.reject(new Error(`Unexpected request: ${routeOf(input)}`));
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function renderSavedDashboard(adviceResult = response(replacementAdvice)) {
  saveAdvice(savedAdvice);
  const fetchMock = installFetch(adviceResult);

  render(<Dashboard profile={profile} onEdit={vi.fn()} />);
  await screen.findByText(savedAdvice.advice.summary);

  return fetchMock;
}

function expectSavedAdviceUnchanged() {
  expect(screen.getByText(savedAdvice.advice.summary)).toBeVisible();
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === "SPAN" &&
        element.textContent === "Generated Fri 7 Aug · 1/1 done",
    ),
  ).toBeVisible();
  expect(
    screen.getByRole("checkbox", { name: 'Mark "Water deeply" as not done' }),
  ).toBeChecked();
  expect(loadSavedAdvice()).toEqual(savedAdvice);
}

describe("Dashboard advice replacement", () => {
  it("uses singular crop grammar in the garden summary", () => {
    installFetch(response(replacementAdvice));

    render(<Dashboard profile={profile} onEdit={vi.fn()} />);

    expect(screen.getByText(/South West England · 1 crop$/)).toBeVisible();
  });

  it("opens confirmation for restored advice without requesting fresh advice", async () => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard();

    await user.click(screen.getByRole("button", { name: "🌱 Get Fresh Advice" }));

    expect(
      screen.getByRole("heading", {
        name: "Fresh advice will replace your current task list.",
      }),
    ).toBeVisible();
    expect(adviceRequestCount(fetchMock)).toBe(0);
  });

  it("keeps restored advice and storage unchanged when replacement is cancelled", async () => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard();

    await user.click(screen.getByRole("button", { name: "🌱 Get Fresh Advice" }));
    await user.click(screen.getByRole("button", { name: "Keep saved tasks" }));

    expect(
      screen.queryByRole("heading", {
        name: "Fresh advice will replace your current task list.",
      }),
    ).not.toBeInTheDocument();
    expect(adviceRequestCount(fetchMock)).toBe(0);
    expectSavedAdviceUnchanged();
  });

  it("makes exactly one advice request after successful confirmation", async () => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard();

    await user.click(screen.getByRole("button", { name: "🌱 Get Fresh Advice" }));
    await user.click(
      screen.getByRole("button", { name: "Replace my task list" }),
    );

    expect(await screen.findByText(replacementAdvice.summary)).toBeVisible();
    expect(adviceRequestCount(fetchMock)).toBe(1);
  });

  it("preserves restored advice and storage after a failed confirmed refresh", async () => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard(
      response({ error: "Advice unavailable" }, 503),
    );

    await user.click(screen.getByRole("button", { name: "🌱 Get Fresh Advice" }));
    await user.click(
      screen.getByRole("button", { name: "Replace my task list" }),
    );

    await waitFor(() => {
      expect(screen.getByText("🥀 Advice unavailable")).toBeVisible();
    });
    expect(adviceRequestCount(fetchMock)).toBe(1);
    expectSavedAdviceUnchanged();
  });
});
