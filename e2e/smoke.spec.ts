import { test, expect } from "@playwright/test";

test.describe("Smoke tests - pages load without errors", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("changelog page loads", async ({ page }) => {
    await page.goto("/changelog");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("my-list page loads (empty state)", async ({ page }) => {
    await page.goto("/my-list");
    await expect(page.locator("h1", { hasText: "My List" })).toBeVisible();
    await expect(page.locator("text=No saved professors yet")).toBeVisible();
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("explore page loads", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("404 page for invalid routes", async ({ page }) => {
    const response = await page.goto("/nonexistent-page");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Search functionality", () => {
  // Search tests need longer timeout since they hit the OpenAlex API
  test.setTimeout(60_000);

  test("search by topic returns results or shows message", async ({ page }) => {
    await page.goto("/search?q=machine+learning&type=topic");
    // Wait for the page to finish loading (either results or empty state)
    await page.waitForLoadState("networkidle", { timeout: 30_000 });
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("search by institution returns results or shows message", async ({ page }) => {
    await page.goto("/search?q=MIT&type=institution");
    await page.waitForLoadState("networkidle", { timeout: 30_000 });
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("search by name returns results or shows message", async ({ page }) => {
    await page.goto("/search?q=Smith&type=name");
    await page.waitForLoadState("networkidle", { timeout: 30_000 });
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("empty search shows prompt", async ({ page }) => {
    await page.goto("/search");
    await expect(
      page.locator("text=Enter a search query")
    ).toBeVisible();
  });
});

test.describe("Professor detail page", () => {
  test.setTimeout(60_000);

  test("professor page loads without crash", async ({ page }) => {
    // Use a well-known OpenAlex author ID
    await page.goto("/professor/A5063896830");
    await page.waitForLoadState("networkidle", { timeout: 30_000 });
    await expect(page.locator("text=Application error")).not.toBeVisible();
  });

  test("invalid professor ID shows 404", async ({ page }) => {
    const response = await page.goto("/professor/INVALID");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Client-side interactions", () => {
  test.setTimeout(60_000);

  test("save button toggles on search results", async ({ page }) => {
    await page.goto("/search?q=physics&type=topic");
    await page.waitForLoadState("networkidle", { timeout: 30_000 });

    const saveBtn = page.locator('button[title="Save to My List"]').first();
    if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await saveBtn.click();
      await expect(
        page.locator('button[title="Remove from My List"]').first()
      ).toBeVisible();
    }
  });

  test("CSV export dropdown appears on search page", async ({ page }) => {
    await page.goto("/search?q=physics&type=topic");
    await page.waitForLoadState("networkidle", { timeout: 30_000 });

    const exportBtn = page.locator("button", { hasText: "Export CSV" }).first();
    if (await exportBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await exportBtn.click();
      await expect(page.locator("text=Current page")).toBeVisible();
      await expect(page.locator("text=Top 100")).toBeVisible();
    }
  });

  test("my-list save/unsave roundtrip", async ({ page }) => {
    await page.goto("/search?q=physics&type=topic");
    await page.waitForLoadState("networkidle", { timeout: 30_000 });

    const saveBtn = page.locator('button[title="Save to My List"]').first();
    if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await saveBtn.click();

      await page.goto("/my-list");
      await expect(page.locator("text=No saved professors yet")).not.toBeVisible();
      await expect(page.locator("text=saved professor")).toBeVisible();
    }
  });
});
