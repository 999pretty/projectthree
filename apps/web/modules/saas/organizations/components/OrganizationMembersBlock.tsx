"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";

import { OrganizationInvitationsList } from "./OrganizationInvitationsList";
import { OrganizationMembersList } from "./OrganizationMembersList";

export const OrganizationMembersBlock = ({
	organizationId,
}: Readonly<{
	organizationId: string;
}>) => {
	const t = useTranslations();
	const [activeTab, setActiveTab] = useState("members");

	return (
		<SettingsItem
			description={t("organizations.settings.members.description")}
			title={t("organizations.settings.members.title")}
		>
			<Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab)}>
				<TabsList className="mb-4">
					<TabsTrigger value="members">
						{t("organizations.settings.members.activeMembers")}
					</TabsTrigger>
					<TabsTrigger value="invitations">
						{t("organizations.settings.members.pendingInvitations")}
					</TabsTrigger>
				</TabsList>
				<TabsContent value="members">
					<OrganizationMembersList organizationId={organizationId} />
				</TabsContent>
				<TabsContent value="invitations">
					<OrganizationInvitationsList organizationId={organizationId} />
				</TabsContent>
			</Tabs>
		</SettingsItem>
	);
};
