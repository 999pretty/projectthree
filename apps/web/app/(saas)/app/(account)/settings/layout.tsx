import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import {
	CreditCardIcon,
	LockKeyholeIcon,
	SettingsIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { config } from "@repo/config";
import { getSession } from "@saas/auth/lib/server";
import { SettingsMenu } from "@saas/settings/components/SettingsMenu";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { SidebarContentLayout } from "@saas/shared/components/SidebarContentLayout";
import { UserAvatar } from "@shared/components/UserAvatar";

export default async function SettingsLayout({ children }: PropsWithChildren) {
	const t = await getTranslations();
	const session = await getSession();

	if (!session) {
		return redirect("/auth/login");
	}

	const menuItems = [
		{
			title: t("settings.menu.account.title"),
			avatar: (
				<UserAvatar
					avatarUrl={session.user.image}
					name={session.user.name ?? ""}
				/>
			),
			items: [
				{
					title: t("settings.menu.account.general"),
					href: "/app/settings/general",
					icon: <SettingsIcon className="size-4 opacity-50" />,
				},
				{
					title: t("settings.menu.account.security"),
					href: "/app/settings/security",
					icon: <LockKeyholeIcon className="size-4 opacity-50" />,
				},
				...(config.users.enableBilling
					? [
							{
								title: t("settings.menu.account.billing"),
								href: "/app/settings/billing",
								icon: <CreditCardIcon className="size-4 opacity-50" />,
							},
						]
					: []),
				{
					title: t("settings.menu.account.dangerZone"),
					href: "/app/settings/danger-zone",
					icon: <TriangleAlertIcon className="size-4 opacity-50" />,
				},
			],
		},
	];

	return (
		<>
			<PageHeader
				subtitle={t("settings.account.subtitle")}
				title={t("settings.account.title")}
			/>
			<SidebarContentLayout sidebar={<SettingsMenu menuItems={menuItems} />}>
				{children}
			</SidebarContentLayout>
		</>
	);
}
