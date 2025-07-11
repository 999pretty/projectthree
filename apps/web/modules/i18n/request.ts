import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "@i18n/lib/locale-cookie";
import { routing } from "@i18n/routing";

import { config } from "@repo/config";
import { getMessagesForLocale } from "@repo/i18n";

// biome-ignore lint/style/noDefaultExport: Library requires default exports
export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;

	locale ??= await getUserLocale();

	if (!(routing.locales.includes(locale) && config.i18n.enabled)) {
		locale = routing.defaultLocale;
	}

	return {
		locale,
		messages: await getMessagesForLocale(locale),
	};
});
