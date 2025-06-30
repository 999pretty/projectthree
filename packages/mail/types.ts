import type { Locale } from "@repo/i18n";

export type SendEmailParams = {
	to: string;
	subject: string;
	text: string;
	html?: string;
};

export type SendEmailHandler = (params: SendEmailParams) => Promise<void>;

export type MailProvider = {
	send: SendEmailHandler;
};

export type BaseMailProps = {
	locale: Locale;
	translations: any;
};
