import { defineConfig, devices } from "@playwright/test";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const launchOptions = executablePath ? { executablePath } : undefined;
export default defineConfig({ testDir: "./e2e", use: { baseURL: "http://localhost:3000", trace: "on-first-retry", launchOptions }, webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: !process.env.CI }, projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }, { name: "mobile-chromium", use: { ...devices["Pixel 7"] } }] });
