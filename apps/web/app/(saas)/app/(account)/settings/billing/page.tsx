import { getTranslations } from "next-intl/server";

import { createPurchasesHelper } from "@repo/payments/lib/helper";
import { getSession } from "@saas/auth/lib/server";
import { ActivePlan } from "@saas/payments/components/ActivePlan";
import { ChangePlan } from "@saas/payments/components/ChangePlan";
import { purchasesQueryKey } from "@saas/payments/lib/api";
import { getPurchases } from "@saas/payments/lib/server";
import { SettingsList } from "@saas/shared/components/SettingsList";
import { getServerQueryClient } from "@shared/lib/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.billing.title"),
	};
}

export default async function BillingSettingsPage() {
	const session = await getSession();
	const purchases = await getPurchases();
	const queryClient = getServerQueryClient();

	await queryClient.prefetchQuery({
		queryKey: purchasesQueryKey(),
		queryFn: () => purchases,
	});

	const { activePlan } = createPurchasesHelper(purchases);

	return (
		<SettingsList>
			{activePlan ? <ActivePlan /> : null}
			<ChangePlan
				activePlanId={activePlan?.id}
				userId={session?.user.id}
			/>
		</SettingsList>
	);
}
