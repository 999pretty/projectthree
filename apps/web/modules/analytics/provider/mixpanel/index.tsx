"use client";

import { useEffect } from "react";
// @ts-expect-error package is not installed per default
import mixpanel from "mixpanel-browser";

const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string;

export const AnalyticsScript = () => {
	useEffect(() => {
		mixpanel.init(mixpanelToken, {
			debug: true,
			track_pageview: true,
			persistence: "localStorage",
		});
	}, []);

	return null;
};

export function useAnalytics() {
	const trackEvent = (event: string, data?: Record<string, unknown>) => {
		mixpanel.track(event, data);
	};

	return {
		trackEvent,
	};
}
