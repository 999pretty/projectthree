import React from "react";

import type { Session } from "@repo/auth";

export const SessionContext = React.createContext<
	| {
			session: Session["session"] | null;
			user: Session["user"] | null;
			loaded: boolean;
			reloadSession: () => Promise<void>;
	  }
	| undefined
>(undefined);
