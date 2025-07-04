import type {
	CreateCheckoutLink,
	CreateCustomerPortalLink,
	SetSubscriptionSeats,
	WebhookHandler,
} from "../../types";

import { Polar } from "@polar-sh/sdk";
import {
	WebhookVerificationError,
	validateEvent,
} from "@polar-sh/sdk/webhooks.js";

import {
	createPurchase,
	deletePurchaseBySubscriptionId,
	getPurchaseBySubscriptionId,
	updatePurchase,
} from "@repo/database";

import { setCustomerIdToEntity } from "../../src/lib/customer";

const polarAccessToken = process.env.POLAR_ACCESS_TOKEN as string;
const polarWebhookSecret = process.env.POLAR_WEBHOOK_SECRET as string;

if (!polarAccessToken) {
	throw new Error("Missing env variable POLAR_ACCESS_TOKEN");
}

if (!polarWebhookSecret) {
	throw new Error("Missing env variable POLAR_WEBHOOK_SECRET");
}

const polarClient = new Polar({
	accessToken: polarAccessToken,
	server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

export const createCheckoutLink: CreateCheckoutLink = async (options) => {
	const { productId, redirectUrl, customerId, organizationId, userId } =
		options;

	const metadata: Record<string, string> = {};

	if (organizationId) {
		metadata.organization_id = organizationId;
	}

	if (userId) {
		metadata.user_id = userId;
	}

	const response = await polarClient.checkouts.create({
		products: [productId],
		successUrl: redirectUrl ?? "",
		metadata,
		customerId: customerId ?? undefined,
	} as any);

	return response.url;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async ({
	customerId,
}) => {
	const response = await polarClient.customerSessions.create({
		customerId: customerId,
	});

	return response.customerPortalUrl;
};

export const setSubscriptionSeats: SetSubscriptionSeats = async () => {
	throw new Error("Not implemented");
};

export const webhookHandler: WebhookHandler = async (req) => {
	try {
		if (!req.body) {
			return new Response("No body", {
				status: 400,
			});
		}

		const event = validateEvent(
			await req.text(),
			Object.fromEntries(req.headers.entries()),
			polarWebhookSecret,
		);

		switch (event.type) {
			case "order.created": {
				const { metadata, customerId, subscription, products } =
					event.data as any;

				if (subscription) {
					break;
				}

				await createPurchase({
					organizationId: (metadata?.organization_id as string) || null,
					userId: (metadata?.user_id as string) || null,
					customerId,
					type: "ONE_TIME",
					productId: products?.[0]?.id,
				});

				await setCustomerIdToEntity(customerId, {
					organizationId: metadata?.organization_id as string,
					userId: metadata?.user_id as string,
				});

				break;
			}
			case "subscription.created": {
				const { metadata, customerId, products, id, status } =
					event.data as any;

				await createPurchase({
					subscriptionId: id,
					organizationId: metadata?.organization_id as string,
					userId: metadata?.user_id as string,
					customerId,
					type: "SUBSCRIPTION",
					productId: products?.[0]?.id,
					status,
				});

				await setCustomerIdToEntity(customerId, {
					organizationId: metadata?.organization_id as string,
					userId: metadata?.user_id as string,
				});

				break;
			}
			case "subscription.updated": {
				const { id, status, products } = event.data as any;

				const existingPurchase = await getPurchaseBySubscriptionId(id);

				if (existingPurchase) {
					await updatePurchase({
						id: existingPurchase.id,
						status,
						productId: products?.[0]?.id,
					});
				}

				break;
			}
			case "subscription.canceled": {
				const { id } = event.data;

				await deletePurchaseBySubscriptionId(id);

				break;
			}

			default:
				return new Response("Unhandled event type.", {
					status: 200,
				});
		}

		return new Response(null, {
			status: 202,
		});
	} catch (error) {
		if (error instanceof WebhookVerificationError) {
			return new Response("Invalid request.", {
				status: 403,
			});
		}
		throw error;
	}
};
