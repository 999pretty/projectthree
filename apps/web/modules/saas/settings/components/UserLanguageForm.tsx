"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateLocale } from "@i18n/lib/update-locale";
import { useMutation } from "@tanstack/react-query";

import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import type { Locale } from "@repo/i18n";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";

const { locales } = config.i18n;

export const UserLanguageForm = () => {
	const currentLocale = useLocale();
	const t = useTranslations();
	const router = useRouter();
	const [locale, setLocale] = useState<Locale | undefined>(
		currentLocale as Locale,
	);

	const updateLocaleMutation = useMutation({
		mutationFn: async () => {
			if (!locale) {
				return;
			}

			await authClient.updateUser({
				locale,
			});
			await updateLocale(locale);
			router.refresh();
		},
	});

	const saveLocale = async () => {
		try {
			await updateLocaleMutation.mutateAsync();

			toast.success(t("settings.account.language.notifications.success"));
		} catch {
			toast.error(t("settings.account.language.notifications.error"));
		}
	};

	return (
		<SettingsItem
			description={t("settings.account.language.description")}
			title={t("settings.account.language.title")}
		>
			<Select
				disabled={updateLocaleMutation.isPending}
				value={locale}
				onValueChange={(value) => {
					setLocale(value as Locale);
					saveLocale();
				}}
			>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{Object.entries(locales).map(([key, value]) => (
						<SelectItem key={key} value={key}>
							{value.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</SettingsItem>
	);
};
