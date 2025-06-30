"use client";

import Script from "next/script";

const umamiTrackingId = process.env.NEXT_PUBLIC_UMAMI_TRACKING_ID as string;

export const AnalyticsScript = () => {
	return (
		<Script
			async
			data-website-id={umamiTrackingId}
			src="https://analytics.eu.umami.is/script.js"
			type="text/javascript"
		/>
	);
};

export function useAnalytics() {
	const trackEvent = (event: string, data?: Record<string, unknown>) => {
		if (typeof window === "undefined" || !(window as any).umami) {
			return;
		}

		(window as any).umami.track(event, {
			props: data,
		});
	};

	return {
		trackEvent,
	};
}
