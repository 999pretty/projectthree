import type { Messages } from "../types";

import deepmerge from "deepmerge";

import { config } from "@repo/config";

export const importLocale = async (locale: string): Promise<Messages> => {
	return (await import(`../translations/${locale}.json`)).default as Messages;
};

export const getMessagesForLocale = async (
	locale: string,
): Promise<Messages> => {
	const localeMessages = await importLocale(locale);
	if (locale === config.i18n.defaultLocale) {
		return localeMessages;
	}
	const defaultLocaleMessages = await importLocale(config.i18n.defaultLocale);
	return deepmerge(defaultLocaleMessages, localeMessages);
};
