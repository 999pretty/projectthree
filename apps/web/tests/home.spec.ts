import { expect, test } from "@playwright/test";

import { config } from "@repo/config";

test.describe("marketing site navigation", () => {
	if (config.ui.marketing.enabled) {
		test("should navigate through main pages and interact with pricing", async ({ page }) => {
			// Start at homepage
			await page.goto("/");

			// Verify homepage content
			await expect(
				page.getByRole("heading", {
					name: "Your revolutionary Next.js SaaS",
				}),
			).toBeVisible();

			// Test navigation visibility with increased timeout
			const navigation = page.locator('nav[data-test="navigation"]');
			await expect(navigation).toBeVisible({ timeout: 10000 });

			// Navigate to Pricing section using the navigation link specifically
			await navigation
				.getByRole("link", { name: config.i18n.enabled ? "Pricing" : "common.menu.pricing" })
				.click();
			
			// Verify pricing section is visible
			await expect(page.getByRole("heading", { name: config.i18n.enabled ? "Pricing" : "pricing.title" })).toBeVisible();
			
			// Test pricing table interaction with increased timeout
			const pricingTable = page.locator('[data-test="price-table-interval-tabs"]');
			await expect(pricingTable).toBeVisible({ timeout: 10000 });

			// Switch to yearly pricing and wait for network idle
			await page.getByRole("tab", { name: config.i18n.enabled ? "Yearly" : "pricing.yearly" }).click();
			await page.waitForLoadState("networkidle");
			
			// Wait for and verify pricing plans with debug info
			const pricingPlans = page.locator('[data-test="price-table-plan"]');
			
			// Log the number of plans found for debugging
			console.log('Number of pricing plans:', await pricingPlans.count());
			
			// Wait for at least one plan to be visible
			await expect(pricingPlans.first()).toBeVisible({ timeout: 10000 });

			// Navigate to FAQ section
			await page.getByRole("link", { name: config.i18n.enabled ? "FAQ" : "common.menu.faq" }).click();
			
			// Wait for navigation and verify FAQ section is visible with correct heading
			await page.waitForLoadState("networkidle");
			await expect(
				page.getByRole("heading", { name: config.i18n.enabled ? "Frequently asked questions" : "faq.title" })
			).toBeVisible({ timeout: 10000 });

			// Click on first FAQ question
			const firstFaqQuestion = page.getByText("What is the refund policy?");
			await firstFaqQuestion.click();
			
			// Verify the answer is visible
			await expect(page.getByText("We offer a 30-day money-back guarantee")).toBeVisible();

			// Find and click the Get Started button in the hero section
			const getStartedButton = page.getByRole("link", { 
				name: "Get started",
			});
			await expect(getStartedButton).toBeVisible({ timeout: 10000 });
			await getStartedButton.click();

			// Wait for navigation and verify redirect to auth page
			await page.waitForLoadState("networkidle");
			await expect(page).toHaveURL(/\.*\/auth\/(login|signup)/, { timeout: 10000 });
		});

		test("should test theme switching and mobile responsiveness", async ({ page }) => {
			// Start at homepage
			await page.goto("/");

			// Test theme toggle
			const themeToggle = page.getByRole("button", { name: "Theme mode" });
			await expect(themeToggle).toBeVisible({ timeout: 10000 });
			await themeToggle.click();

			// Select dark theme from dropdown
			const darkThemeOption = page.locator('[data-test="color-mode-toggle-item-dark"]');
			await expect(darkThemeOption).toBeVisible({ timeout: 10000 });
			await darkThemeOption.click();

			// Wait for theme change and verify dark mode class
			const html = page.locator("html");
			await expect(html).toHaveClass(/font-plex.*dark/, { timeout: 10000 });

			// Test mobile menu on smaller viewport
			await page.setViewportSize({ width: 640, height: 800 });

			// Open mobile menu
			const mobileMenuButton = page.getByRole("button", { name: "Menu" });
			await expect(mobileMenuButton).toBeVisible();
			await mobileMenuButton.click();

			// Verify mobile menu items
			await expect(
				page.getByRole("link", { name: config.i18n.enabled ? "Docs" : "common.menu.docs" })
			).toBeVisible();

			// Navigate through mobile menu
			await page.getByRole("link", { name: config.i18n.enabled ? "Changelog" : "common.menu.changelog" }).click();

			// Verify navigation to changelog
			await expect(
				page.getByRole("heading", { name: config.i18n.enabled ? "Changelog" : "changelog.title" })
			).toBeVisible();
		});
	} else {
		test("should be redirected to app", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL(/\.*\/auth\/login/);
		});
	}
});
