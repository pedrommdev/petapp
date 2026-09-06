import { expect, test } from "@playwright/test";

test.describe("catalog search", () => {
  test("renders breed cards on home", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Find yours" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Siamese/ })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /German Shepherd/ }),
    ).toBeVisible();
  });

  test("search siamese filters the grid and writes q", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search breeds").fill("siamese");
    await expect(page).toHaveURL(/[?&]q=siamese/);
    await expect(page.getByRole("link", { name: /Siamese/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Maine Coon/ })).toHaveCount(0);
    await expect(page.getByText("1 breed matches")).toBeVisible();
  });

  test("search GSD matches the German Shepherd alias", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search breeds").fill("GSD");
    await expect(page).toHaveURL(/[?&]q=GSD/);
    await expect(
      page.getByRole("link", { name: /German Shepherd/ }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Siamese/ })).toHaveCount(0);
  });

  test("URL hydrates the search field", async ({ page }) => {
    await page.goto("/?q=siamese");
    await expect(page.getByLabel("Search breeds")).toHaveValue("siamese");
    await expect(page.getByRole("link", { name: /Siamese/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Maine Coon/ })).toHaveCount(0);
  });
});
