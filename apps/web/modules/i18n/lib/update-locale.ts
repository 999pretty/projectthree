"use server";

import { revalidatePath } from "next/cache";
import { setLocaleCookie } from "@i18n/lib/locale-cookie";

import type { Locale } from "@repo/i18n";

export async function updateLocale(locale: Locale) {
	await setLocaleCookie(locale);
	revalidatePath("/");
}
