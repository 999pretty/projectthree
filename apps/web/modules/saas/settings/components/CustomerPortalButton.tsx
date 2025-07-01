"use client";

import { useTranslations } from "next-intl";
import { CreditCardIcon } from "lucide-react";
import { toast } from "sonner";

import { useCreateCustomerPortalLinkMutation } from "@saas/payments/lib/api";
import { Button } from "@ui/components/button";

export const CustomerPortalButton = ({
	purchaseId,
}: Readonly<{ purchaseId: string }>) => {
	const t = useTranslations();
	const createCustomerPortalMutation = useCreateCustomerPortalLinkMutation();

	const createCustomerPortal = async () => {
		try {
			const { customerPortalLink } =
				await createCustomerPortalMutation.mutateAsync({
					purchaseId,
					redirectUrl: window.location.href,
				});

			window.location.href = customerPortalLink;
		} catch {
			toast.error(
				t("settings.billing.createCustomerPortal.notifications.error.title"),
			);
		}
	};

	return (
		<Button
			loading={createCustomerPortalMutation.isPending}
			size="sm"
			variant="light"
			onClick={() => createCustomerPortal()}
		>
			<CreditCardIcon className="mr-2 size-4" />
			{t("settings.billing.createCustomerPortal.label")}
		</Button>
	);
};
