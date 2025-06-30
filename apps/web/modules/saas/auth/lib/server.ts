import { cache } from "react";
import { headers } from "next/headers";
import "server-only";

import { auth } from "@repo/auth";
import { getInvitationById } from "@repo/database";

export const getSession = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
		query: {
			disableCookieCache: true,
		},
	});

	return session;
});

export const getActiveOrganization = cache(async (slug: string) => {
	try {
		const activeOrganization = await auth.api.getFullOrganization({
			query: {
				organizationSlug: slug,
			},
			headers: await headers(),
		});

		return activeOrganization;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Failed to get active organization:", error);
		}
		return null;
	}
});

export const getOrganizationList = cache(async () => {
	try {
		const organizationList = await auth.api.listOrganizations({
			headers: await headers(),
		});

		return organizationList;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Failed to get organization list:", error);
		}
		return [];
	}
});

export const getUserAccounts = cache(async () => {
	try {
		const userAccounts = await auth.api.listUserAccounts({
			headers: await headers(),
		});

		return userAccounts;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Failed to get user accounts:", error);
		}
		return [];
	}
});

export const getUserPasskeys = cache(async () => {
	try {
		const userPasskeys = await auth.api.listPasskeys({
			headers: await headers(),
		});

		return userPasskeys;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Failed to get user passkeys:", error);
		}
		return [];
	}
});

export const getInvitation = cache(async (id: string) => {
	try {
		return await getInvitationById(id);
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Failed to get invitation:", error);
		}
		return null;
	}
});
