import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";
import { getOrganizationById } from "@repo/database";
import { OrganizationInvitationModal } from "@saas/organizations/components/OrganizationInvitationModal";

export default async function OrganizationInvitationPage({
	params,
}: {
	params: Promise<{ invitationId: string }>;
}) {
	const { invitationId } = await params;

	const invitation = await auth.api.getInvitation({
		query: {
			id: invitationId,
		},
		headers: await headers(),
	});

	if (!invitation) {
		redirect("/app");
	}

	const organization = await getOrganizationById(invitation.organizationId);

	return (
		<OrganizationInvitationModal
			invitationId={invitationId}
			logoUrl={organization?.logo || undefined}
			organizationName={invitation.organizationName}
			organizationSlug={invitation.organizationSlug}
		/>
	);
}
