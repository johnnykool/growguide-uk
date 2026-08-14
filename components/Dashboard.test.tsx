import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
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
  vi.restoreAllMocks();
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
  profileFingerprint:
    "v1|BS15AH|51.4545|-2.5879|south west england|tomato|small|raised-beds|trowel",
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
  saveAdvice(savedAdvice, profile);
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
  expect(loadSavedAdvice(profile)).toEqual(savedAdvice);
}

describe("Dashboard weather", () => {
  it("composes weather, plot context, and actions as the first workspace", () => {
    installFetch(response(replacementAdvice));

    render(<Dashboard profile={profile} onEdit={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Weather, translated into action.",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Your plot profile" }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: "What needs doing" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Get growing advice" }),
    ).toBeVisible();
  });

  it("labels the local forecast with the garden postcode", async () => {
    installFetch(response(replacementAdvice));

    render(<Dashboard profile={profile} onEdit={vi.fn()} />);

    const forecast = await screen.findByRole("region", {
      name: "Local forecast",
    });
    expect(forecast).toHaveTextContent("BS1 5AH");
  });
});

describe("Dashboard advice replacement", () => {
  it("uses singular crop grammar in the garden summary", () => {
    installFetch(response(replacementAdvice));

    render(<Dashboard profile={profile} onEdit={vi.fn()} />);

    expect(screen.getByText(/South West England · 1 crop$/)).toBeVisible();
  });

  it("opens confirmation for restored advice without requesting fresh advice", async () => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard();

    await user.click(screen.getByRole("button", { name: "Get fresh advice" }));

    expect(
      screen.getByRole("heading", {
        name: "Fresh advice will replace your current task list.",
      }),
    ).toBeVisible();
    expect(adviceRequestCount(fetchMock)).toBe(0);
  });

  it("does not restore advice saved for a different garden profile", async () => {
    saveAdvice(savedAdvice, profile);
    installFetch(response(replacementAdvice));

    render(
      <Dashboard
        profile={{ ...profile, vegetables: ["tomato", "courgette"] }}
        onEdit={vi.fn()}
      />,
    );

    expect(await screen.findByRole("button", { name: "Get growing advice" })).toBeVisible();
    expect(screen.queryByText(savedAdvice.advice.summary)).not.toBeInTheDocument();
  });

  it("keeps restored advice and storage unchanged when replacement is cancelled", async () => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard();

    await user.click(screen.getByRole("button", { name: "Get fresh advice" }));
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

    await user.click(screen.getByRole("button", { name: "Get fresh advice" }));
    await user.click(
      screen.getByRole("button", { name: "Replace my task list" }),
    );

    expect(await screen.findByText(replacementAdvice.summary)).toBeVisible();
    expect(adviceRequestCount(fetchMock)).toBe(1);
  });

  it("moves focus from confirmation to the polite loading status", async () => {
    const user = userEvent.setup();
    let resolveAdvice!: (value: FetchResult) => void;
    const pendingAdvice = new Promise<FetchResult>((resolve) => {
      resolveAdvice = resolve;
    });
    saveAdvice(savedAdvice, profile);
    const fetchMock = vi.fn().mockImplementation((input: unknown) => {
      if (routeOf(input) === "/api/weather") {
        return Promise.resolve(response(weather));
      }
      if (routeOf(input) === "/api/advice") return pendingAdvice;
      return Promise.reject(new Error(`Unexpected request: ${routeOf(input)}`));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Dashboard profile={profile} onEdit={vi.fn()} />);
    await screen.findByText(savedAdvice.advice.summary);
    await user.click(screen.getByRole("button", { name: "Get fresh advice" }));
    await user.click(
      screen.getByRole("button", { name: "Replace my task list" }),
    );

    const status = await screen.findByRole("status", {
      name: "Generating growing advice",
    });
    expect(status).toHaveFocus();
    expect(status).toHaveAttribute("aria-live", "polite");

    await act(async () => {
      resolveAdvice(response(replacementAdvice));
      await pendingAdvice;
    });
  });

  it("keeps generated advice visible and warns when browser storage rejects it", async () => {
    const user = userEvent.setup();
    installFetch(response(replacementAdvice));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });

    render(<Dashboard profile={profile} onEdit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Get growing advice" }));

    expect(await screen.findByText(replacementAdvice.summary)).toBeVisible();
    expect(
      screen.getByRole("alert", {
        name: /advice wasn't saved in this browser/i,
      }),
    ).toBeVisible();
    expect(screen.queryByText(/Your saved tasks are below/i)).not.toBeInTheDocument();
    expect(loadSavedAdvice(profile)).toBeNull();
  });

  it("hides technical server detail while preserving saved advice after a failed refresh", async () => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard(
      response(
        {
          error:
            "Advice service is not configured (missing ANTHROPIC_API_KEY).",
        },
        500,
      ),
    );

    await user.click(screen.getByRole("button", { name: "Get fresh advice" }));
    await user.click(
      screen.getByRole("button", { name: "Replace my task list" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "We can't generate growing advice right now. Please try again.",
        ),
      ).toBeVisible();
    });
    expect(screen.queryByText(/ANTHROPIC_API_KEY/)).not.toBeInTheDocument();
    expect(adviceRequestCount(fetchMock)).toBe(1);
    expectSavedAdviceUnchanged();
  });

  it.each([
    {
      name: "uses specific timeout guidance for a 504 response",
      status: 504,
      apiError: "The upstream request timed out.",
      expected:
        "The advice took too long to generate — try a shorter timeline or fewer vegetables, then try again.",
    },
    {
      name: "retains safe API copy for a representative 4xx response",
      status: 400,
      apiError: "Choose at least one crop and try again.",
      expected: "Choose at least one crop and try again.",
    },
  ])("$name", async ({ status, apiError, expected }) => {
    const user = userEvent.setup();
    const fetchMock = await renderSavedDashboard(
      response({ error: apiError }, status),
    );

    await user.click(screen.getByRole("button", { name: "Get fresh advice" }));
    await user.click(
      screen.getByRole("button", { name: "Replace my task list" }),
    );

    expect(await screen.findByText(expected)).toBeVisible();
    expect(adviceRequestCount(fetchMock)).toBe(1);
    expectSavedAdviceUnchanged();
  });

  it("aborts and discards an advice response that completes after unmount", async () => {
    const user = userEvent.setup();
    let resolveAdvice!: (value: FetchResult) => void;
    const pendingAdvice = new Promise<FetchResult>((resolve) => {
      resolveAdvice = resolve;
    });
    const fetchMock = vi.fn().mockImplementation((input: unknown) => {
      if (routeOf(input) === "/api/weather") {
        return Promise.resolve(response(weather));
      }
      return pendingAdvice;
    });
    vi.stubGlobal("fetch", fetchMock);

    const view = render(<Dashboard profile={profile} onEdit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Get growing advice" }));
    await waitFor(() => expect(adviceRequestCount(fetchMock)).toBe(1));
    const adviceCall = fetchMock.mock.calls.find(
      ([input]) => routeOf(input) === "/api/advice",
    );
    const signal = adviceCall?.[1]?.signal as AbortSignal | undefined;

    view.unmount();
    expect(signal?.aborted).toBe(true);

    await act(async () => {
      resolveAdvice(response(replacementAdvice));
      await pendingAdvice;
    });
    expect(loadSavedAdvice(profile)).toBeNull();
  });

  it("discards an obsolete advice response after the profile changes", async () => {
    const user = userEvent.setup();
    let resolveAdvice!: (value: FetchResult) => void;
    const pendingAdvice = new Promise<FetchResult>((resolve) => {
      resolveAdvice = resolve;
    });
    const fetchMock = vi.fn().mockImplementation((input: unknown) => {
      if (routeOf(input) === "/api/weather") {
        return Promise.resolve(response(weather));
      }
      return pendingAdvice;
    });
    vi.stubGlobal("fetch", fetchMock);

    const view = render(<Dashboard profile={profile} onEdit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Get growing advice" }));
    await waitFor(() => expect(adviceRequestCount(fetchMock)).toBe(1));

    const nextProfile = { ...profile, postcode: "EH1 1YZ", lat: 55.9533, lng: -3.1883 };
    view.rerender(<Dashboard profile={nextProfile} onEdit={vi.fn()} />);

    await act(async () => {
      resolveAdvice(response(replacementAdvice));
      await pendingAdvice;
    });
    expect(loadSavedAdvice(profile)).toBeNull();
    expect(loadSavedAdvice(nextProfile)).toBeNull();
    expect(
      screen.getByRole("button", { name: "Get growing advice" }),
    ).toBeEnabled();
  });
});
