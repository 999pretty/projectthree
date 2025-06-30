import { logger as honoLogger } from "hono/logger";

import { logger } from "@repo/logs";

export const loggerMiddleware = honoLogger((message, ...rest) => {
	logger.log(message, ...rest);
});
