import type { NextConfig } from "next";

import nextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";
import { withContentCollections } from "@content-collections/next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = nextIntlPlugin("./modules/i18n/request.ts");

const nextConfig: NextConfig = {
	transpilePackages: ["@repo/api", "@repo/auth", "@repo/database"],
	images: {
		remotePatterns: [
			{
				// google profile images
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				// github profile images
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
		],
	},
	// Security headers configuration
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value:
							"camera=(), microphone=(), geolocation=(), interest-cohort=()",
					},
					{
						// Content Security Policy
						key: "Content-Security-Policy",
						value:
							process.env.NODE_ENV === "production"
								? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.sentry.io https://api.projectthree.dev;"
								: "", // Empty in development to avoid issues with hot reloading
					},
				],
			},
		];
	},
	webpack: (config) => {
		// Suppress webpack warnings during analysis builds for cleaner output
		if (process.env.ANALYZE === "true") {
			config.stats = {
				...config.stats,
				warnings: false,
			};
			config.ignoreWarnings = [
				() => true, // Ignore all warnings during analysis
			];
		}
		return config;
	},
	async redirects() {
		return [
			{
				source: "/app/settings",
				destination: "/app/settings/general",
				permanent: true,
			},
			{
				source: "/app/:organizationSlug/settings",
				destination: "/app/:organizationSlug/settings/general",
				permanent: true,
			},
			{
				source: "/app/admin",
				destination: "/app/admin/users",
				permanent: true,
			},
		];
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	telemetry: process.env.NEXT_TELEMETRY_DISABLED === "1",
};

const config = withNextIntl(
	withContentCollections(
		withBundleAnalyzer({
			enabled: process.env.ANALYZE === "true",
		})(nextConfig),
	),
);

// Only apply Sentry config if not disabled
export default process.env.SENTRY_DISABLED
	? config
	: withSentryConfig(config, {
			org: "projectthree",
			project: "projectthree",
			authToken: process.env.SENTRY_AUTH_TOKEN,
			tunnelRoute: "/monitoring-tunnel",
			silent: true, // Set to true to reduce noise during tests
		});
