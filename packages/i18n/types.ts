import type messages from "./translations/en.json";

import type { config } from "@repo/config";

export type Messages = typeof messages;

export type Locale = keyof (typeof config)["i18n"]["locales"];
