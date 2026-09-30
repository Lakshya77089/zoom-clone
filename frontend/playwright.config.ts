import { defineConfig, devices } from "@playwright/test";
import testServers from "./scripts/test-servers.cjs";

const { BASE_URL, EXTERNAL, servers } = testServers;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results/playwright",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { outputFolder: "./test-results/playwright-report", open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: ["camera", "microphone", "clipboard-read", "clipboard-write"],
    launchOptions: {
      args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
  webServer: EXTERNAL
    ? undefined
    : servers.map((server) => ({
        name: server.name,
        command: server.command,
        cwd: server.cwd,
        url: server.url,
        env: Object.fromEntries(Object.entries(server.env)),
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      })),
});
