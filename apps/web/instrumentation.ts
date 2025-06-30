export async function register() {
	if (process.env.SENTRY_DISABLED) {
		return;
	}

	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./sentry.server.config");
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		await import("./sentry.edge.config");
	}
}

export const onRequestError = process.env.SENTRY_DISABLED
	? undefined
	: (() => {
			try {
				return require("@sentry/nextjs").captureRequestError;
			} catch {
				return undefined;
			}
		})();
