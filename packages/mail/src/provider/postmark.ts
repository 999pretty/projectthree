import type { SendEmailHandler } from "../../types";

import { config } from "@repo/config";
import { logger } from "@repo/logs";

const { from } = config.mails;

export const send: SendEmailHandler = async ({ to, subject, html, text }) => {
	// Postmark requires either HtmlBody or TextBody to be present
	const emailBody = html ?? text;

	if (!emailBody) {
		throw new Error("Either html or text must be provided");
	}

	const body: any = {
		From: from,
		To: to,
		Subject: subject,
		MessageStream: "outbound",
	};

	// If html is provided and not empty, use it; otherwise use text
	if (html) {
		body.HtmlBody = html;
	} else {
		body.TextBody = text;
	}

	const response = await fetch("https://api.postmarkapp.com/email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN as string,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		logger.error(await response.json());

		throw new Error("Could not send email");
	}
};
