import { expect, test } from "@playwright/test";

test.describe("empty results", () => {
  test("combo filters swap the grid for empty copy, then clear restores and focuses search", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: "Cats" }).click();
    await page.getByRole("button", { name: "Small" }).click();

    await expect(page).toHaveURL(/species=cat/);
    await expect(page).toHaveURL(/size=small/);
    await expect(
      page.getByRole("heading", { name: "No pals in this mix." }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Nothing matches those filters. Try fewer chips, or clear them and start over.",
      ),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Siamese/ })).toHaveCount(0);
    await expect(page.getByText("0 breeds match")).toBeVisible();
    await expect(page.getByLabel("Search breeds")).toBeVisible();
    await expect(page.getByRole("button", { name: "Small" })).toBeVisible();

    await page.getByRole("button", { name: "Clear filters" }).click();

    await expect(page).not.toHaveURL(/[?&](q|species|size)=/);
    await expect(page.getByLabel("Search breeds")).toBeFocused();
    await expect(
      page.getByRole("heading", { name: "No pals in this mix." }),
    ).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Siamese/ })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /German Shepherd/ }),
    ).toBeVisible();
    await expect(page.getByRole("radio", { name: "All" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  test("direct empty URL keeps chips and the empty panel on #breed-grid", async ({
    page,
  }) => {
    await page.goto("/?species=cat&size=small");
    await expect(page.locator("#breed-grid")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "No pals in this mix." }),
    ).toBeVisible();
    await expect(page.getByRole("radio", { name: "Cats" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByRole("button", { name: "Small" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
