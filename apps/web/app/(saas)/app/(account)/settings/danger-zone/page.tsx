import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "@saas/auth/lib/server";
import { DeleteAccountForm } from "@saas/settings/components/DeleteAccountForm";
import { SettingsList } from "@saas/shared/components/SettingsList";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.account.title"),
	};
}

export default async function AccountSettingsPage() {
	const session = await getSession();

	if (!session) {
		return redirect("/auth/login");
	}

	return (
		<SettingsList>
			<DeleteAccountForm />
		</SettingsList>
	);
}
