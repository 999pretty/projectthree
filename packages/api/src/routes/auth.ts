import { Hono } from "hono";

import { auth } from "@repo/auth";

export const authRouter = new Hono()
	.get("/auth/**", (c) => {
		return auth.handler(c.req.raw);
	})
	.post("/auth/**", (c) => {
		return auth.handler(c.req.raw);
	});
