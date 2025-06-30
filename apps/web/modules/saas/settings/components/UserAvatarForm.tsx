"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { SettingsItem } from "@saas/shared/components/SettingsItem";

import { UserAvatarUpload } from "./UserAvatarUpload";

export const UserAvatarForm = () => {
	const t = useTranslations();

	return (
		<SettingsItem
			description={t("settings.account.avatar.description")}
			title={t("settings.account.avatar.title")}
		>
			<UserAvatarUpload
				onError={() => {
					toast.error(
						t("settings.account.avatar.notifications.error"),
					);
				}}
				onSuccess={() => {
					toast.success(
						t("settings.account.avatar.notifications.success"),
					);
				}}
			/>
		</SettingsItem>
	);
};
