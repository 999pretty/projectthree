import { cors } from "hono/cors";

import { getBaseUrl } from "@repo/utils";

export const corsMiddleware = cors({
	origin: getBaseUrl(),
	allowHeaders: ["Content-Type", "Authorization"],
	allowMethods: ["POST", "GET", "OPTIONS"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
	credentials: true,
});
