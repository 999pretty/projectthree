"use client";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { authClient } from "@repo/auth/client";
import { sessionQueryKey, useSessionQuery } from "@saas/auth/lib/api";

import { SessionContext } from "../lib/session-context";

export const SessionProvider = ({
	children,
}: Readonly<{
	children: ReactNode;
}>) => {
	const queryClient = useQueryClient();

	const { data: session } = useSessionQuery();
	const [loaded, setLoaded] = useState(!!session);

	useEffect(() => {
		if (session && !loaded) {
			setLoaded(true);
		}
	}, [session, loaded]);

	const contextValue = useMemo(
		() => ({
			loaded,
			session: session?.session ?? null,
			user: session?.user ?? null,
			reloadSession: async () => {
				const { data: newSession, error } = await authClient.getSession({
					query: {
						disableCookieCache: true,
					},
				});

				if (error) {
					throw new Error(error.message ?? "Failed to fetch session");
				}

				queryClient.setQueryData(sessionQueryKey, () => newSession);
			},
		}),
		[loaded, session?.session, session?.user, queryClient],
	);

	return (
		<SessionContext.Provider value={contextValue}>
			{children}
		</SessionContext.Provider>
	);
};
