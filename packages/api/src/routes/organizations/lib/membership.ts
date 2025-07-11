import { HTTPException } from "hono/http-exception";

import { getOrganizationMembership } from "@repo/database";

export async function verifyOrganizationMembership(
	organizationId: string,
	userId: string,
) {
	const membership = await getOrganizationMembership(organizationId, userId);

	if (!membership) {
		throw new HTTPException(404, {
			message: "User is not a member of this organization",
		});
	}

	return {
		organization: membership.organization,
		role: membership.role,
	};
}
