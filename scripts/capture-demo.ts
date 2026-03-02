import { chromium } from "playwright";
import path from "path";

const BASE_URL = process.env.DEMO_URL || "http://localhost:3001";
const OUT_DIR = path.resolve("public/demo");

interface Step {
  id: string;
  caption: string;
  action: (page: import("playwright").Page) => Promise<void>;
}

const steps: Step[] = [
  {
    id: "01-homepage",
    caption: "Search by topic, name, or institution",
    action: async (page) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState("networkidle");
      // Wait for client hydration
      await page.waitForSelector("form", { timeout: 10_000 });
      await page.waitForTimeout(1000);
    },
  },
  {
    id: "02-search-typing",
    caption: "Type any research topic to find experts",
    action: async (page) => {
      // Fill the search input on the homepage
      const input = page.locator("form input").first();
      await input.click();
      await input.fill("Machine Learning");
      await page.waitForTimeout(500);
    },
  },
  {
    id: "03-search-results",
    caption: "Browse professors with citation metrics and filters",
    action: async (page) => {
      await page.goto(
        `${BASE_URL}/search?q=Machine+Learning&type=topic`
      );
      await page.waitForLoadState("networkidle", { timeout: 30_000 });
      await page.waitForTimeout(3000);
    },
  },
  {
    id: "04-save-professor",
    caption: "Save professors to your shortlist with one click",
    action: async (page) => {
      const saveBtn = page.locator('button[title="Save to My List"]').first();
      if (await saveBtn.isVisible({ timeout: 5000 })) {
        await saveBtn.click();
        await page.waitForTimeout(800);
      }
    },
  },
  {
    id: "05-professor-profile",
    caption: "See publications, topics, co-authors, and more",
    action: async (page) => {
      const link = page.locator('a[href^="/professor/"]').first();
      if (await link.isVisible({ timeout: 5000 })) {
        await link.click();
        await page.waitForLoadState("networkidle", { timeout: 30_000 });
        await page.waitForTimeout(3000);
      }
    },
  },
  {
    id: "06-email-generator",
    caption: "Draft a personalized cold email in one click",
    action: async (page) => {
      const emailBtn = page
        .locator("button", { hasText: /email|draft/i })
        .first();
      if (await emailBtn.isVisible({ timeout: 5000 })) {
        await emailBtn.click();
        await page.waitForTimeout(1500);
      }
    },
  },
  {
    id: "07-my-list",
    caption: "Track outreach, add notes, and manage your list",
    action: async (page) => {
      await page.goto(`${BASE_URL}/my-list`);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);
    },
  },
  {
    id: "08-network-explorer",
    caption: "Explore collaboration networks in 3D",
    action: async (page) => {
      await page.goto(`${BASE_URL}/explore`);
      await page.waitForLoadState("networkidle");
      // Wait for the explore page form to be ready
      await page.waitForSelector("form", { timeout: 10_000 });
      await page.waitForTimeout(1000);
      const input = page.locator("form input").first();
      await input.fill("Machine Learning");
      await page.keyboard.press("Enter");
      await page.waitForLoadState("networkidle", { timeout: 30_000 });
      await page.waitForTimeout(5000);
    },
  },
];

async function main() {
  console.log(`Capturing demo screenshots from ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const manifest: { id: string; caption: string; file: string }[] = [];

  for (const step of steps) {
    try {
      console.log(`  ${step.id}: ${step.caption}`);
      await step.action(page);
      const file = `${step.id}.png`;
      await page.screenshot({
        path: path.join(OUT_DIR, file),
        fullPage: false,
      });
      manifest.push({ id: step.id, caption: step.caption, file });
      console.log(`    -> saved`);
    } catch (err) {
      console.error(`    -> FAILED:`, (err as Error).message);
    }
  }

  // Write manifest for the demo page to consume
  const manifestPath = path.join(OUT_DIR, "manifest.json");
  const fs = await import("fs");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${manifestPath}`);

  await browser.close();
  console.log("Done!");
}

main();
