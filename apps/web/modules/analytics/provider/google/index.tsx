"use client";

import { GoogleAnalytics, sendGAEvent } from "@next/third-parties/google";

const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string;

export const AnalyticsScript = () => {
	return <GoogleAnalytics gaId={googleTagId} />;
};

export function useAnalytics() {
	const trackEvent = sendGAEvent;

	return {
		trackEvent,
	};
}
