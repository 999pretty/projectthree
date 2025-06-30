import type { TemplateId } from "./templates";
import type { mailTemplates } from "../../emails";

import { config } from "@repo/config";
import { logger } from "@repo/logs";

import { send } from "../provider";

import { getTemplate } from "./templates";

export async function sendEmail<T extends TemplateId>(
	params: {
		to: string;
		locale?: keyof typeof config.i18n.locales;
	} & (
		| {
				templateId: T;
				context: Omit<
					Parameters<(typeof mailTemplates)[T]>[0],
					"locale" | "translations"
				>;
		  }
		| {
				subject: string;
				text?: string;
				html?: string;
		  }
	),
) {
	const { to, locale = config.i18n.defaultLocale } = params;

	let html: string;
	let text: string;
	let subject: string;

	try {
		if ("templateId" in params) {
			const { templateId, context } = params;
			logger.info("Rendering email template", { templateId, context });
			const template = await getTemplate({
				templateId,
				context,
				locale,
			});
			subject = template.subject;
			text = template.text;
			html = template.html;
		} else {
			subject = params.subject;
			text = params.text ?? "";
			html = params.html ?? "";
		}

		logger.info("Attempting to send email", {
			to,
			subject,
			hasHtml: !!html,
			hasText: !!text,
		});

		await send({
			to,
			subject,
			text,
			html,
		});

		logger.info("Email sent successfully", {
			to,
			subject,
		});

		return true;
	} catch (e) {
		logger.error("Failed to send email", {
			error: e,
			to,
			params,
		});
		// Re-throw the error so it's not silently caught
		throw e;
	}
}
