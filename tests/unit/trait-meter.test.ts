import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TraitMeter } from "@/components/TraitMeter";

describe("TraitMeter", () => {
  it("exposes an accessible name with the numeric score", () => {
    const html = renderToStaticMarkup(
      createElement(TraitMeter, { label: "Energy", value: 4 }),
    );
    expect(html).toContain("Energy, 4 out of 5");
    expect(html).toContain("role=\"img\"");
  });

  it("renders five circles and does not show a visible 1–5 number", () => {
    const html = renderToStaticMarkup(
      createElement(TraitMeter, { label: "Shedding", value: 2 }),
    );
    expect(html.match(/rounded-full/g)?.length).toBe(5);
    expect(html).not.toMatch(/>[1-5]</);
    expect(html).not.toContain("progressbar");
  });
});
