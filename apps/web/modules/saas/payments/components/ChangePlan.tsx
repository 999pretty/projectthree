"use client";
import { useTranslations } from "next-intl";

import { PricingTable } from "@saas/payments/components/PricingTable";
import { SettingsItem } from "@saas/shared/components/SettingsItem";

export const ChangePlan = ({
	organizationId,
	userId,
	activePlanId,
}: Readonly<{
	organizationId?: string;
	userId?: string;
	activePlanId?: string;
}>) => {
	const t = useTranslations();

	return (
		<SettingsItem
			description={t("settings.billing.changePlan.description")}
			title={t("settings.billing.changePlan.title")}
		>
			<PricingTable
				activePlanId={activePlanId}
				organizationId={organizationId}
				userId={userId}
			/>
		</SettingsItem>
	);
};
