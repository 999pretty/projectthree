"use client";

import { usePlanData } from "@saas/payments/hooks/plan-data";
import { usePurchases } from "@saas/payments/hooks/purchases";
import { Badge } from "@ui/components/badge";

export const ActivePlanBadge = ({
	organizationId,
}: Readonly<{
	organizationId?: string;
}>) => {
	const { planData } = usePlanData();
	const { activePlan } = usePurchases(organizationId);

	if (!activePlan) {
		return null;
	}

	const activePlanData = planData[activePlan.id as keyof typeof planData];

	if (!activePlanData) {
		return null;
	}
	return (
		<Badge
			className="flex items-center gap-1 px-1.5 text-xs normal-case"
			status="info"
		>
			{activePlanData.title}
		</Badge>
	);
};
