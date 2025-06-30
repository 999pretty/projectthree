import { useTranslations } from "next-intl";
import { MailCheckIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";

export const OrganizationInvitationAlert = ({
	className,
}: Readonly<{ className?: string }>) => {
	const t = useTranslations();
	return (
		<Alert className={className} variant="primary">
			<MailCheckIcon />
			<AlertTitle>{t("organizations.invitationAlert.title")}</AlertTitle>
			<AlertDescription>
				{t("organizations.invitationAlert.description")}
			</AlertDescription>
		</Alert>
	);
};
