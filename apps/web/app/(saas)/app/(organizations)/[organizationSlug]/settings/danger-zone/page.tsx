import { getTranslations } from "next-intl/server";

import { DeleteOrganizationForm } from "@saas/organizations/components/DeleteOrganizationForm";
import { SettingsList } from "@saas/shared/components/SettingsList";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("organizations.settings.dangerZone.title"),
	};
}

export default function OrganizationSettingsPage() {
	return (
		<SettingsList>
			<DeleteOrganizationForm />
		</SettingsList>
	);
}
