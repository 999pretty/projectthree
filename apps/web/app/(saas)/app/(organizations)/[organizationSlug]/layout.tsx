import type { PropsWithChildren } from "react";
import { notFound } from "next/navigation";

import { config } from "@repo/config";
import { getActiveOrganization } from "@saas/auth/lib/server";
import { ActiveOrganizationProvider } from "@saas/organizations/components/ActiveOrganizationProvider";
import { activeOrganizationQueryKey } from "@saas/organizations/lib/api";
import { purchasesQueryKey } from "@saas/payments/lib/api";
import { getPurchases } from "@saas/payments/lib/server";
import { AppWrapper } from "@saas/shared/components/AppWrapper";
import { getServerQueryClient } from "@shared/lib/server";

export default async function OrganizationLayout({
	children,
	params,
}: PropsWithChildren<{
	params: Promise<{
		organizationSlug: string;
	}>;
}>) {
	const { organizationSlug } = await params;

	const fullOrganization = await getActiveOrganization(organizationSlug);

	if (!fullOrganization) {
		return notFound();
	}

	// Transform to match ActiveOrganizationProvider's expected type
	const initialOrganization = {
		id: fullOrganization.id,
		name: fullOrganization.name,
		slug: fullOrganization.slug ?? null,
		logo: fullOrganization.logo ?? null,
		createdAt: fullOrganization.createdAt,
		metadata: fullOrganization.metadata ?? null,
		paymentsCustomerId: null,
	};

	const queryClient = getServerQueryClient();

	await queryClient.prefetchQuery({
		queryKey: activeOrganizationQueryKey(organizationSlug),
		queryFn: () => fullOrganization,
	});

	if (config.users.enableBilling) {
		await queryClient.prefetchQuery({
			queryKey: purchasesQueryKey(fullOrganization.id),
			queryFn: () => getPurchases(fullOrganization.id),
		});
	}

	return (
		<ActiveOrganizationProvider
			key={fullOrganization.id}
			initialOrganization={initialOrganization}
		>
			<AppWrapper>{children}</AppWrapper>
		</ActiveOrganizationProvider>
	);
}
