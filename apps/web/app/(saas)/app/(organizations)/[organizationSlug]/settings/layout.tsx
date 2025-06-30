import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import {
	CreditCardIcon,
	Settings2Icon,
	TriangleAlertIcon,
	Users2Icon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { isOrganizationAdmin } from "@repo/auth/lib/helper";
import { config } from "@repo/config";
import { getActiveOrganization, getSession } from "@saas/auth/lib/server";
import { OrganizationLogo } from "@saas/organizations/components/OrganizationLogo";
import { SettingsMenu } from "@saas/settings/components/SettingsMenu";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { SidebarContentLayout } from "@saas/shared/components/SidebarContentLayout";

export default async function SettingsLayout({
	children,
	params,
}: PropsWithChildren<{
	params: Promise<{ organizationSlug: string }>;
}>) {
	const t = await getTranslations();
	const session = await getSession();
	const { organizationSlug } = await params;
	const organization = await getActiveOrganization(organizationSlug);

	if (!organization) {
		redirect("/app");
	}

	const userIsOrganizationAdmin = isOrganizationAdmin(
		organization,
		session?.user,
	);

	const organizationSettingsBasePath = `/app/${organizationSlug}/settings`;

	const menuItems = [
		{
			title: t("settings.menu.organization.title"),
			avatar: (
				<OrganizationLogo
					logoUrl={organization.logo}
					name={organization.name}
				/>
			),
			items: [
				{
					title: t("settings.menu.organization.general"),
					href: `${organizationSettingsBasePath}/general`,
					icon: <Settings2Icon className="size-4 opacity-50" />,
				},
				{
					title: t("settings.menu.organization.members"),
					href: `${organizationSettingsBasePath}/members`,
					icon: <Users2Icon className="size-4 opacity-50" />,
				},
				...(config.organizations.enable &&
				config.organizations.enableBilling &&
				userIsOrganizationAdmin
					? [
							{
								title: t("settings.menu.organization.billing"),
								href: `${organizationSettingsBasePath}/billing`,
								icon: (
									<CreditCardIcon className="size-4 opacity-50" />
								),
							},
							{
								title: t(
									"settings.menu.organization.dangerZone",
								),
								href: `${organizationSettingsBasePath}/danger-zone`,
								icon: (
									<TriangleAlertIcon className="size-4 opacity-50" />
								),
							},
						]
					: []),
			],
		},
	];

	return (
		<>
			<PageHeader
				subtitle={t("organizations.settings.subtitle")}
				title={t("organizations.settings.title")}
			/>
			<SidebarContentLayout
				sidebar={<SettingsMenu menuItems={menuItems} />}
			>
				{children}
			</SidebarContentLayout>
		</>
	);
}
