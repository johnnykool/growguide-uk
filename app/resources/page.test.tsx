import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ResourcesPage, { metadata } from "./page";
import { RESOURCES } from "@/data/resources";

afterEach(cleanup);

describe("resources page", () => {
  it("offers previews and downloads backed by real public files", () => {
    render(<ResourcesPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Resources" })).toBeVisible();
    expect(screen.getByRole("img")).toBeVisible();
    for (const resource of RESOURCES) {
      for (const edition of resource.editions) {
        const link = screen.getByRole("link", { name: `Download ${edition.format} PDF` });
        expect(link).toHaveAttribute("href", edition.href);
        expect(link).toHaveAttribute("download");
        expect(existsSync(resolve("public", edition.href.slice(1)))).toBe(true);
        for (const preview of edition.previews) {
          expect(existsSync(resolve("public", preview.src.slice(1)))).toBe(true);
        }
      }
    }
    expect(metadata.alternates).toEqual({ canonical: "/resources" });
  });
});
