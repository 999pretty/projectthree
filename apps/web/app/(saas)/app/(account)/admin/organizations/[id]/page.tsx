import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { auth } from "@repo/auth";
import { OrganizationForm } from "@saas/admin/component/organizations/OrganizationForm";
import { getAdminPath } from "@saas/admin/lib/links";
import { fullOrganizationQueryKey } from "@saas/organizations/lib/api";
import { Button } from "@ui/components/button";
import { getServerQueryClient } from "@shared/lib/server";

export default async function OrganizationFormPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ backTo?: string }>;
}) {
	const { id } = await params;
	const { backTo } = await searchParams;

	const t = await getTranslations();
	const queryClient = getServerQueryClient();

	await queryClient.prefetchQuery({
		queryKey: fullOrganizationQueryKey(id),
		queryFn: async () =>
			await auth.api.getFullOrganization({
				query: {
					organizationId: id,
				},
				headers: await headers(),
			}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div>
				<div className="mb-2 flex justify-start">
					<Button asChild className="px-0" size="sm" variant="link">
						<Link href={backTo ?? getAdminPath("/organizations")}>
							<ArrowLeftIcon className="mr-1.5 size-4" />
							{t("admin.organizations.backToList")}
						</Link>
					</Button>
				</div>
				<OrganizationForm organizationId={id} />
			</div>
		</HydrationBoundary>
	);
}
