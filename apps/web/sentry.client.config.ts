import * as Sentry from "@sentry/nextjs";

if (!process.env.SENTRY_DISABLED) {
	Sentry.init({
		dsn: "https://a19de6cb0beb3b0f5b5874eb59901f84@o4508742845857792.ingest.de.sentry.io/4508742854574160",
		integrations: [Sentry.replayIntegration()],
		tracesSampleRate: 1,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
		debug: false,
		enabled: process.env.NODE_ENV === "production",
	});
}
