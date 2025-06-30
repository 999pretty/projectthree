"use client";

import { useCookieConsent } from "@shared/hooks/cookie-consent";

import { AnalyticsScript } from ".";

export const AnalyticsWrapper = () => {
	const { userHasConsented } = useCookieConsent();

	return userHasConsented ? <AnalyticsScript /> : null;
};
