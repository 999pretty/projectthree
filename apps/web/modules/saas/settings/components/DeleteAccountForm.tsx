"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { authClient } from "@repo/auth/client";
import { useSession } from "@saas/auth/hooks/use-session";
import { useConfirmationAlert } from "@saas/shared/components/ConfirmationAlertProvider";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import {} from "@ui/components/alert-dialog";
import { Button } from "@ui/components/button";

export const DeleteAccountForm = () => {
	const t = useTranslations();
	const { reloadSession } = useSession();
	const { confirm } = useConfirmationAlert();

	const deleteUserMutation = useMutation({
		mutationFn: async () => {
			const { error } = await authClient.deleteUser({});

			if (error) {
				throw error;
			}
		},
		onSuccess: () => {
			toast.success(
				t("settings.account.deleteAccount.notifications.success"),
			);
			reloadSession();
		},
		onError: () => {
			toast.error(
				t("settings.account.deleteAccount.notifications.error"),
			);
		},
	});

	const confirmDelete = () => {
		confirm({
			title: t("settings.account.deleteAccount.title"),
			message: t("settings.account.deleteAccount.confirmation"),
			onConfirm: async () => {
				await deleteUserMutation.mutateAsync();
			},
		});
	};

	return (
		<SettingsItem
			danger
			description={t("settings.account.deleteAccount.description")}
			title={t("settings.account.deleteAccount.title")}
		>
			<div className="mt-4 flex justify-end">
				<Button variant="error" onClick={() => confirmDelete()}>
					{t("settings.account.deleteAccount.submit")}
				</Button>
			</div>
		</SettingsItem>
	);
};
