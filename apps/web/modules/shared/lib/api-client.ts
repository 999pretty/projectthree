import { hc } from "hono/client";

import type { AppRouter } from "@repo/api";
import { getBaseUrl } from "@repo/utils";

export const apiClient = hc<AppRouter>(getBaseUrl(), {
	init: {
		credentials: "include",
	},
}).api;
