import * as Sentry from "@sentry/nextjs";

if (!process.env.SENTRY_DISABLED) {
	Sentry.init({
		dsn: "https://a19de6cb0beb3b0f5b5874eb59901f84@o4508742845857792.ingest.de.sentry.io/4508742854574160",

		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
		tracesSampleRate: 1,

		// Disable Debug mode in production
		debug: false,

		enabled: process.env.NODE_ENV === "production",
	});
}
