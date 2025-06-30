import { cookies } from "next/headers";
import "server-only";

import { config } from "@repo/config";
import type { Locale } from "@repo/i18n";

export async function getUserLocale() {
	const cookie = (await cookies()).get(config.i18n.localeCookieName);
	return cookie?.value ?? config.i18n.defaultLocale;
}

export async function setLocaleCookie(locale: Locale) {
	(await cookies()).set(config.i18n.localeCookieName, locale);
}
