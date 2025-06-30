import type { PropsWithChildren } from "react";

import { ActiveOrganizationProvider } from "@saas/organizations/components/ActiveOrganizationProvider";
import { AppWrapper } from "@saas/shared/components/AppWrapper";

export default function UserLayout({ children }: PropsWithChildren) {
	return (
		<ActiveOrganizationProvider initialOrganization={null}>
			<AppWrapper>{children}</AppWrapper>
		</ActiveOrganizationProvider>
	);
}
