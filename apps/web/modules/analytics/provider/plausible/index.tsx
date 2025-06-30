"use client";

import Script from "next/script";

const plausibleUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_URL as string;

export const AnalyticsScript = () => {
	return (
		<Script
			defer
			data-domain={plausibleUrl}
			src="https://plausible.io/js/script.js"
			type="text/javascript"
		/>
	);
};

export function useAnalytics() {
	const trackEvent = (event: string, data?: Record<string, unknown>) => {
		if (typeof window === "undefined" || !(window as any).plausible) {
			return;
		}

		(window as any).plausible(event, {
			props: data,
		});
	};

	return {
		trackEvent,
	};
}
