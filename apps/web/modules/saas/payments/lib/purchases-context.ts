import React from "react";

import type { PlanId } from "@saas/payments/types";

export const PurchasesContext = React.createContext<
	| {
			activeSubscription: {
				id: string;
				purchaseId?: string;
			} | null;
			loaded: boolean;
			hasSubscription: (planIds?: PlanId[] | PlanId) => boolean;
			refetchPurchases: () => Promise<void>;
			hasPurchase: (planId: PlanId) => boolean;
	  }
	| undefined
>(undefined);
