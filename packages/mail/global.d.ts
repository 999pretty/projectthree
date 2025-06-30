import type { config } from "./config";

import type { Messages } from "@repo/i18n/types";

declare global {
	type IntlMessages = Messages;

	namespace NodeJS {
		type ProcessEnv = {
			[key in keyof typeof config]: (typeof config)[key];
		};
	}
}
