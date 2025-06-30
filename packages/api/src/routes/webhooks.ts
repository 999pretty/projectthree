import { Hono } from "hono";
import { describeRoute } from "hono-openapi";

import { webhookHandler as paymentsWebhookHandler } from "@repo/payments";

export const webhooksRouter = new Hono().post(
	"/webhooks/payments",
	describeRoute({
		tags: ["Webhooks"],
		summary: "Handle payments webhook",
	}),
	(c) => {
		return paymentsWebhookHandler(c.req.raw);
	},
);
