"use client";

import Script from "next/script";

const pirschCode = process.env.NEXT_PUBLIC_PIRSCH_CODE as string;

export const AnalyticsScript = () => {
	return (
		<Script
			defer
			data-code={pirschCode}
			id="pirschextendedjs"
			src="https://api.pirsch.io/pirsch-extended.js"
			type="text/javascript"
		/>
	);
};

export function useAnalytics() {
	const trackEvent = (event: string, data?: Record<string, unknown>) => {
		if (typeof window === "undefined" || !(window as any).pirsch) {
			return;
		}

		(window as any).pirsch(event, {
			meta: data,
		});
	};

	return {
		trackEvent,
	};
}
