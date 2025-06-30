"use client";

import {
	type PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import type { ActiveOrganization } from "@repo/auth";
import { authClient } from "@repo/auth/client";
import { isOrganizationAdmin } from "@repo/auth/lib/helper";
import type { Organization } from "@repo/database";
import { useSession } from "@saas/auth/hooks/use-session";
import { ActiveOrganizationContext } from "@saas/organizations/lib/active-organization-context";
import { fullOrganizationQueryKey } from "@saas/organizations/lib/api";

export { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";

export const ActiveOrganizationProvider = ({
	children,
	initialOrganization,
}: PropsWithChildren<{
	initialOrganization?: Organization | null;
}>) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { session, user } = useSession();
	const [loaded, setLoaded] = useState(false);
	const [activeOrganization, setActiveOrganization] =
		useState<ActiveOrganization | null>(null);

	useEffect(() => {
		if (initialOrganization) {
			// Immediately set a minimal ActiveOrganization to prevent flash
			const minimalActiveOrganization = {
				id: initialOrganization.id,
				name: initialOrganization.name,
				slug: initialOrganization.slug,
				logo: initialOrganization.logo,
				createdAt: initialOrganization.createdAt,
				metadata: initialOrganization.metadata,
				members: [], // Will be populated when full data loads
				invitations: [], // Will be populated when full data loads
			} as ActiveOrganization;

			setActiveOrganization(minimalActiveOrganization);

			// Then fetch the full organization data to get members and invitations
			const fetchFullOrganization = async () => {
				try {
					const { data, error } =
						await authClient.organization.getFullOrganization({
							query: {
								organizationId: initialOrganization.id,
							},
						});

					if (error) {
						console.error("Failed to fetch full organization:", error);
						// Keep the minimal organization rather than setting to null
					} else {
						setActiveOrganization(data);
					}
				} catch (error) {
					console.error("Failed to fetch full organization:", error);
					// Keep the minimal organization rather than setting to null
				}
			};

			fetchFullOrganization();
		} else {
			setActiveOrganization(null);
		}
	}, [initialOrganization]);

	const refetchActiveOrganization = useCallback(async () => {
		if (!activeOrganization?.id) {
			return;
		}

		const { data, error } = await authClient.organization.getFullOrganization({
			query: {
				organizationId: activeOrganization.id,
			},
		});

		if (error) {
			throw error;
		}

		setActiveOrganization(data);
		queryClient.setQueryData(fullOrganizationQueryKey(data.id), data);
	}, [activeOrganization?.id, queryClient]);

	const switchActiveOrganization = useCallback(
		async (organizationId: string | null) => {
			if (organizationId) {
				try {
					const { data, error } =
						await authClient.organization.getFullOrganization({
							query: {
								organizationId,
							},
						});

					if (error) {
						throw error;
					}

					setActiveOrganization(data);
					router.refresh();
				} catch (error) {
					console.error("Failed to set active organization:", error);
				}
			} else {
				setActiveOrganization(null);
				router.refresh();
			}
		},
		[router],
	);

	useEffect(() => {
		if (!session) {
			setActiveOrganization(null);
		}

		setLoaded(true);
	}, [session]);

	const activeOrganizationUserRole = useMemo(() => {
		if (!activeOrganization || !user) {
			return null;
		}

		const member = activeOrganization?.members?.find(
			(member) => member.userId === user.id,
		);
		return member?.role ?? null;
	}, [activeOrganization, user]);

	const isUserOrganizationAdmin = useMemo(() => {
		return isOrganizationAdmin(activeOrganization, user);
	}, [activeOrganization, user]);

	const value = useMemo(
		() => ({
			activeOrganization,
			activeOrganizationUserRole,
			isOrganizationAdmin: isUserOrganizationAdmin,
			loaded,
			refetchActiveOrganization,
			setActiveOrganization: switchActiveOrganization,
		}),
		[
			activeOrganization,
			activeOrganizationUserRole,
			isUserOrganizationAdmin,
			loaded,
			refetchActiveOrganization,
			switchActiveOrganization,
		],
	);

	return (
		<ActiveOrganizationContext.Provider value={value}>
			{children}
		</ActiveOrganizationContext.Provider>
	);
};
