import { expect, test } from "@playwright/test";

test.describe("breed detail similar", () => {
  test("open a breed, click similar, land on the other slug", async ({
    page,
  }) => {
    await page.goto("/breeds/maine-coon");

    await expect(
      page.getByRole("heading", { level: 1, name: "Maine Coon" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "If you like this" }),
    ).toBeVisible();
    await expect(
      page.getByText("Close in lifestyle and looks, not a ranking."),
    ).toBeVisible();
    await expect(page.getByText("Recommended for you")).toHaveCount(0);

    const similar = page.getByRole("region", { name: "If you like this" });
    const cards = similar.getByRole("link");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(4);

    const first = cards.first();
    const href = await first.getAttribute("href");
    expect(href).toMatch(/^\/breeds\/.+/);
    expect(href).not.toBe("/breeds/maine-coon");

    await first.click();
    await expect(page).toHaveURL(href!);
    await expect(
      page.getByRole("heading", { level: 1, name: "Maine Coon" }),
    ).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
