"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { authClient } from "@repo/auth/client";
import { useSession } from "@saas/auth/hooks/use-session";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { Button } from "@ui/components/button";

export const SetPasswordForm = () => {
	const t = useTranslations();
	const { user } = useSession();
	const [submitting, setSubmitting] = useState(false);

	const onSubmit = async () => {
		if (!user) {
			return;
		}

		setSubmitting(true);

		await authClient.forgetPassword(
			{
				email: user.email,
				redirectTo: `${window.location.origin}/auth/reset-password`,
			},
			{
				onSuccess: () => {
					toast.success(
						t("settings.account.security.setPassword.notifications.success"),
					);
				},
				onError: () => {
					toast.error(
						t("settings.account.security.setPassword.notifications.error"),
					);
				},
				onResponse: () => {
					setSubmitting(false);
				},
			},
		);
	};

	return (
		<SettingsItem
			description={t("settings.account.security.setPassword.description")}
			title={t("settings.account.security.setPassword.title")}
		>
			<div className="flex justify-end">
				<Button loading={submitting} type="submit" onClick={onSubmit}>
					{t("settings.account.security.setPassword.submit")}
				</Button>
			</div>
		</SettingsItem>
	);
};
