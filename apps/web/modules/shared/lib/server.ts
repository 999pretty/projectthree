import { cache } from "react";
import { headers } from "next/headers";
import { hc } from "hono/client";
import "server-only";

import type { AppRouter } from "@repo/api";
import { getBaseUrl } from "@repo/utils";
import { createQueryClient } from "@shared/lib/query-client";

export const getServerQueryClient = cache(createQueryClient);

export const getServerApiClient = async () => {
	const headerObject = Object.fromEntries((await headers()).entries());

	return hc<AppRouter>(getBaseUrl(), {
		init: {
			credentials: "include",
			headers: headerObject,
		},
	}).api;
};
