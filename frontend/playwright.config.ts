import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Nexus E2E tests.
 * Run with: npx playwright test
 * Open UI:  npx playwright test --ui
 */
export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: process.env.BASE_URL ?? "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    // Start the Next.js dev server before running tests in local mode
    webServer: process.env.CI
        ? undefined
        : {
            command: "npm run dev",
            url: "http://localhost:3000",
            reuseExistingServer: true,
            timeout: 60_000,
        },
});
