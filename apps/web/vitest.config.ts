/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./tests/setup.ts",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
		include: ["**/__tests__/**/*.test.{ts,tsx}", "**/tests/**/*.test.{ts,tsx}"],
		exclude: [
			"**/tests/*.spec.ts",
			"**/tests/setup.ts",
			"**/tests/test.setup.ts",
			"**/e2e/**",
			"**/playwright/**",
			"**/node_modules/**",
		],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./"),
			"@ui": resolve(__dirname, "./modules/ui"),
			"@i18n": resolve(__dirname, "./modules/i18n"),
			"@shared": resolve(__dirname, "./modules/shared"),
			"@repo/i18n": resolve(__dirname, "../i18n/src"),
			"@repo/config": resolve(__dirname, "../config/src"),
			"@repo/utils": resolve(__dirname, "../utils/src"),
			"@repo/database": resolve(__dirname, "../database/src"),
			"@repo/auth": resolve(__dirname, "../auth/src"),
			"@repo/api": resolve(__dirname, "../api/src"),
			"@repo/mail": resolve(__dirname, "../mail/src"),
			"@repo/payments": resolve(__dirname, "../payments/src"),
			"@repo/storage": resolve(__dirname, "../storage/src"),
		},
	},
});
