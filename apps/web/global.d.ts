import type { config } from "./config";
import type { JSX as Jsx } from "react/jsx-runtime";

import type { Messages } from "@repo/i18n";

// temporary fix for mdx types
// TODO: remove once mdx has fully compatibility with react 19
declare global {
	namespace JSX {
		type ElementClass = Jsx.ElementClass;
		type Element = Jsx.Element;
		type IntrinsicElements = Jsx.IntrinsicElements;
	}

	type IntlMessages = Messages;

	namespace NodeJS {
		type ProcessEnv = {
			[key in keyof typeof config]: (typeof config)[key];
		};
	}
}
