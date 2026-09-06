import { expect, test } from "@playwright/test";

test.describe("catalog filters", () => {
  test("species=cat keeps cats and writes the URL", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: "Cats" }).click();
    await expect(page).toHaveURL(/[?&]species=cat/);
    await expect(page.getByRole("radio", { name: "Cats" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByRole("link", { name: /Siamese/ })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /German Shepherd/ }),
    ).toHaveCount(0);
  });

  test("URL hydrates chips", async ({ page }) => {
    await page.goto("/?species=cat&size=medium&energy=high&apartment=1");
    await expect(page.getByRole("radio", { name: "Cats" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByRole("button", { name: "Medium" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByRole("button", { name: "High energy" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "Apartment OK" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: /Siamese/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Maine Coon/ })).toHaveCount(0);
  });

  test("tapping an active size chip clears it", async ({ page }) => {
    await page.goto("/");
    const large = page.getByRole("button", { name: "Large" });
    await large.click();
    await expect(page).toHaveURL(/[?&]size=large/);
    await expect(large).toHaveAttribute("aria-pressed", "true");
    await large.click();
    await expect(page).not.toHaveURL(/size=/);
    await expect(large).toHaveAttribute("aria-pressed", "false");
  });

  test("shared /?species=cat first HTML is cats-only and does not hydrate-error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    const response = await page.goto("/?species=cat");
    expect(response?.ok()).toBeTruthy();
    const html = (await response?.text()) ?? "";
    const gridStart = html.indexOf('id="breed-grid"');
    const footerStart = html.indexOf("<footer", gridStart);
    const gridHtml = html.slice(
      gridStart,
      footerStart === -1 ? undefined : footerStart,
    );
    expect(gridHtml).toContain("/breeds/siamese");
    expect(gridHtml).toContain("/breeds/maine-coon");
    expect(gridHtml).not.toContain("/breeds/german-shepherd");
    expect(gridHtml).not.toContain("/breeds/golden-retriever");

    await expect(page.getByRole("link", { name: /Siamese/ })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /German Shepherd/ }),
    ).toHaveCount(0);
    expect(
      errors.filter((message) => /hydrat/i.test(message)),
      errors.join("\n"),
    ).toEqual([]);
  });
});
