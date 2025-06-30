import type { SendEmailHandler } from "../../types";

import { config } from "@repo/config";
import { logger } from "@repo/logs";

const { from } = config.mails;

export const send: SendEmailHandler = async ({ to, subject, html, text }) => {
	// Resend requires either html or text to be present and non-empty
	const emailBody = html ?? text;

	if (!emailBody) {
		throw new Error("Either html or text must be provided");
	}

	const body: any = {
		from,
		to,
		subject,
	};

	// If html is provided and not empty, use it; otherwise use text
	if (html) {
		body.html = html;
	} else {
		body.text = text;
	}

	try {
		logger.info("Attempting to send email", {
			to,
			from,
			subject,
			hasHtml: !!html,
			hasText: !!text,
		});

		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorData = await response.json();
			logger.error("Failed to send email", {
				status: response.status,
				statusText: response.statusText,
				error: errorData,
				to,
				from,
				subject,
			});
			throw new Error(JSON.stringify(errorData));
		}

		logger.info("Email sent successfully", {
			to,
			from,
			subject,
		});
	} catch (error) {
		logger.error("Error sending email", {
			error,
			to,
			from,
			subject,
		});
		throw error;
	}
};
