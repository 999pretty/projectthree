"use client";

import type { PropsWithChildren } from "react";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createQueryClient } from "@shared/lib/query-client";

let clientQueryClientSingleton: QueryClient;
function getQueryClient() {
	if (typeof window === "undefined") {
		return createQueryClient();
	}

	if (!clientQueryClientSingleton) {
		clientQueryClientSingleton = createQueryClient();
	}

	return clientQueryClientSingleton;
}

export const ApiClientProvider = ({
	children,
}: Readonly<PropsWithChildren>) => {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
