import type { PropsWithChildren } from "react";

import { AuthWrapper } from "@saas/shared/components/AuthWrapper";

//  : Next.js requires default exports for layout files
export default function WithoutOrganizationSlugLayout({
	children,
}: PropsWithChildren) {
	return <AuthWrapper>{children}</AuthWrapper>;
}
