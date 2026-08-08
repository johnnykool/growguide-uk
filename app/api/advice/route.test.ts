import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function adviceRequest() {
  return new Request("http://localhost/api/advice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vegetables: ["tomato"] }),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/advice", () => {
  it("keeps the missing-configuration status while hiding configuration details", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");

    const response = await POST(adviceRequest());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      error: "We can't generate growing advice right now. Please try again.",
    });
    expect(JSON.stringify(payload)).not.toMatch(/ANTHROPIC|API_KEY/);
  });
});
