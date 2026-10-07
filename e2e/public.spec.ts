import { expect, test } from "@playwright/test";

test("identity and selected work navigation are prominent", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Selected work/i })).toBeVisible();
  await page.getByRole("contentinfo").getByRole("link", { name: "Publications", exact: true }).click();
  await expect(page).toHaveURL(/publications/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Research outputs");
});

test("availability opportunities appear one after another", async ({ page }) => {
  await page.goto("/");
  const item = page.locator(".availability-ticker-item");
  await expect(item).toHaveCount(1);
  const first = await item.textContent();
  await expect.poll(async () => await item.count() === 1 ? item.textContent() : null, { timeout: 5_000 }).not.toBe(first);
});

test("self.py introduces the author without clipping the profile card", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "self.py" }).click();

  const profile = page.locator("section.profile-flip-back");
  await expect(profile).toHaveAttribute("aria-hidden", "false");
  await expect(profile.getByText("~/identity/self.py", { exact: true })).toBeVisible();
  await expect(profile.getByText("Core traits", { exact: true })).toBeVisible();
  await expect(profile.getByText(/useful work, built with care/i)).toBeVisible();
  await expect(profile.locator(".selfpy-signal")).toBeVisible();

  const dimensions = await profile.evaluate((element) => ({
    clientHeight: element.clientHeight,
    clientWidth: element.clientWidth,
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight + 1);
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});

test("skills are grouped into a compact interactive explorer", async ({ page }) => {
  await page.goto("/skills");
  await expect(page.getByRole("heading", { level: 1, name: /Focused skills/i })).toBeVisible();
  await expect(page.locator(".skill-focus-panel")).toBeVisible();
  const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("mobile navigation is keyboard accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  const mobileNavigation = page.locator("#mobile-nav");
  await expect(mobileNavigation.getByRole("link", { name: "Home", exact: true })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Experience", exact: true })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Research", exact: true })).toHaveCount(0);
  await expect(mobileNavigation.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
});

test("highlighted papers and projects have an accessible content section", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const work = page.locator("#selected-work");
  await expect(work.getByRole("heading", { name: /Selected work/i })).toBeVisible();
  await expect(work.getByText("Highlighted papers & projects", { exact: true })).toBeVisible();
});

test("publication detail uses a responsive research visualization", async ({ page }) => {
  await page.goto("/publications");
  const publication = page.locator('a[href^="/publications/"]').first();
  await expect(publication).toBeVisible();
  await publication.click();
  await expect(page.getByRole("figure", { name: /Feature extraction|Attention-guided|Detection and confidence/i })).toBeVisible();
  const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("publication index presents a useful record summary and compact index", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/publications");
  await expect(page.getByText("Featured record", { exact: true })).toBeVisible();
  await expect(page.getByPlaceholder("Title, author, keyword, venue, or DOI")).toHaveCount(0);
  await expect(page.getByText("Complete index", { exact: true })).toBeVisible();
  await expect(page.getByText("Papers", { exact: true })).toBeVisible();
  await expect(page.getByText("Latest year", { exact: true })).toBeVisible();
  await expect(page.getByRole("figure", { name: /Representation learning|Visual inference field|Attention fusion/i })).toBeVisible();
});

test("contextual ML and CV ornaments match the page purpose", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("figure", { name: "Visual inference field" })).toBeVisible();
  await page.goto("/experience");
  await expect(page.getByRole("figure", { name: "Attention fusion" })).toBeVisible();
  await page.goto("/contact");
  await expect(page.getByRole("figure", { name: "Representation learning" })).toBeVisible();
});

test("ornamented pages remain within the mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/publications", "/projects", "/experience", "/contact"]) {
    await page.goto(path);
    const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(sizes.content, `${path} should not overflow horizontally`).toBeLessThanOrEqual(sizes.viewport);
  }
});

test("education compares SSC, HSC, and BSc results without inventing missing records", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/education");
  await expect(page.getByRole("heading", { name: /SSC.*HSC.*BSc/, exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /result stair plot/i })).toBeVisible();
  await expect(page.locator('[data-stair-segment="plateau"]')).toHaveCount(3);
  await expect(page.locator('[data-stair-segment="connector"]')).toHaveCount(2);
  const stages = page.locator("[data-stage]");
  await expect(stages).toHaveCount(3);
  await expect(stages.nth(0)).toHaveAttribute("data-stage", "ssc");
  await expect(stages.nth(1)).toHaveAttribute("data-stage", "hsc");
  await expect(stages.nth(2)).toHaveAttribute("data-stage", "bsc");
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    plotWidth: document.querySelector('[role="img"][aria-labelledby*="education-plot"]')?.getBoundingClientRect().width ?? 0,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.plotWidth).toBeLessThanOrEqual(sizes.viewport);
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("reduced motion keeps core research content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Selected work/i })).toBeVisible();
});

test("contact page exposes a complete accessible inquiry form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { level: 1, name: /clear question/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Tell me what you are working on/i })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Send inquiry/i })).toBeVisible();
});

test("experience page presents the admin-managed professional record", async ({ page }) => {
  await page.goto("/experience");
  await expect(page.getByRole("heading", { level: 1, name: /professional record/i })).toBeVisible();
  await expect(page.getByText(/Experience record coming soon|Professional timeline/).first()).toBeVisible();
});

