import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "@saas/auth/lib/server";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { UserStart } from "@saas/start/UserStart";

export default async function AppStartPage() {
	const session = await getSession();

	if (!session) {
		return redirect("/auth/login");
	}

	const t = await getTranslations();

	return (
		<>
			<PageHeader
				subtitle={t("app.start.subtitle")}
				title={t("app.start.title")}
			/>
			<UserStart />
		</>
	);
}
