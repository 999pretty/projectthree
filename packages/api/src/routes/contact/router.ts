import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/zod";
import { z } from "zod";

import { config } from "@repo/config";
import { logger } from "@repo/logs";
import { sendEmail } from "@repo/mail";

import { localeMiddleware } from "../../middleware/locale";

import { contactFormSchema } from "./types";

// Helper function to escape HTML entities
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export const contactRouter = new Hono().basePath("/contact").post(
	"/",
	localeMiddleware,
	validator("form", contactFormSchema),
	describeRoute({
		tags: ["Contact"],
		summary: "Send a message from the contact form",
		description: "Send a message with an email and name",
		responses: {
			204: {
				description: "Message sent",
			},
			400: {
				description: "Could not send message",
				content: {
					"application/json": {
						schema: resolver(z.object({ error: z.string() })),
					},
				},
			},
		},
	}),
	async (c) => {
		const { email, name, message } = c.req.valid("form");
		const locale = c.get("locale");

		// Escape user input to prevent HTML injection
		const safeName = escapeHtml(name);
		const safeEmail = escapeHtml(email);
		const safeMessage = escapeHtml(message);

		const textContent = `Name: ${name}\n\nEmail: ${email}\n\nMessage: ${message}`;
		const htmlContent = `
			<h2>New Contact Form Submission</h2>
			<p><strong>Name:</strong> ${safeName}</p>
			<p><strong>Email:</strong> ${safeEmail}</p>
			<p><strong>Message:</strong></p>
			<p>${safeMessage.replace(/\n/g, "<br>")}</p>
		`;

		try {
			await sendEmail({
				to: config.contactForm.to,
				locale,
				subject: config.contactForm.subject,
				text: textContent,
				html: htmlContent,
			});

			return c.body(null, 204);
		} catch (error) {
			logger.error(error);
			return c.json({ error: "Could not send email" }, 500);
		}
	},
);
