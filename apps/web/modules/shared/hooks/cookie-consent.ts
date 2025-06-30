"use client";

import { useContext } from "react";

import { ConsentContext } from "@shared/components/ConsentProvider";

export function useCookieConsent() {
	return useContext(ConsentContext);
}
