import path from "node:path";

import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Ensure Sentry is disabled during tests
process.env.SENTRY_DISABLED = "true";
// NODE_ENV is set to "test" via cross-env in package.json scripts

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["html"]],
	use: {
		baseURL: "http://localhost:3001",
		trace: "on-first-retry",
		video: {
			mode: "retain-on-failure",
			size: { width: 640, height: 480 },
		},
	},
	projects: [
		{ name: "setup", testMatch: /.*\.setup\.ts/ },
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
			},
		},
	],
	webServer: {
		command: "pnpm --filter web run start:e2e",
		url: "http://localhost:3001",
		reuseExistingServer: !process.env.CI,
		stdout: "pipe",
		timeout: 180 * 1000,
	},
});
