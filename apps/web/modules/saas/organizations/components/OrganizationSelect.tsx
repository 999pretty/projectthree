"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";

import { config } from "@repo/config";
import { useSession } from "@saas/auth/hooks/use-session";
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useOrganizationListQuery } from "@saas/organizations/lib/api";
import { ActivePlanBadge } from "@saas/payments/components/ActivePlanBadge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { UserAvatar } from "@shared/components/UserAvatar";
import { useRouter } from "@shared/hooks/router";

import { OrganizationLogo } from "./OrganizationLogo";

export const OrganizationSelect = ({
	className,
}: Readonly<{ className?: string }>) => {
	const t = useTranslations();
	const { user } = useSession();
	const router = useRouter();
	const { activeOrganization } = useActiveOrganization();
	const { data: allOrganizations } = useOrganizationListQuery();

	if (!user) {
		return null;
	}

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-md border p-2 text-left outline-none focus-visible:bg-primary/10 focus-visible:ring-none">
					<div className="flex flex-1 items-center justify-start gap-2 overflow-hidden text-sm">
						{activeOrganization ? (
							<>
								<OrganizationLogo
									className="hidden size-6 sm:block"
									logoUrl={activeOrganization.logo}
									name={activeOrganization.name}
								/>
								<span className="block flex-1 truncate">
									{activeOrganization.name}
								</span>
								{config.organizations.enableBilling ? (
									<ActivePlanBadge organizationId={activeOrganization.id} />
								) : null}
							</>
						) : (
							<>
								<UserAvatar
									avatarUrl={user.image}
									className="hidden size-6 sm:block"
									name={user.name ?? ""}
								/>
								<span className="block truncate">
									{t("organizations.organizationSelect.personalAccount")}
								</span>
								{config.users.enableBilling ? <ActivePlanBadge /> : null}
							</>
						)}
					</div>

					<ChevronsUpDownIcon className="block size-4 opacity-50" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-full">
					{!config.organizations.requireOrganization && (
						<>
							<DropdownMenuRadioGroup
								value={!activeOrganization ? user.id : undefined}
								onValueChange={(value: string) => {
									if (value === user.id) {
										router.replace("/app");
									}
								}}
							>
								<DropdownMenuLabel className="text-foreground/60 text-xs">
									{t("organizations.organizationSelect.personalAccount")}
								</DropdownMenuLabel>
								<DropdownMenuRadioItem
									className="flex cursor-pointer items-center justify-center gap-2 pl-3"
									value={user.id}
								>
									<div className="flex flex-1 items-center justify-start gap-2">
										<UserAvatar
											avatarUrl={user.image}
											className="size-8"
											name={user.name ?? ""}
										/>
										{user.name}
									</div>
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
							<DropdownMenuSeparator />
						</>
					)}
					<DropdownMenuRadioGroup
						value={activeOrganization?.slug ?? undefined}
						onValueChange={(organizationSlug: string) => {
							router.replace(`/app/${organizationSlug}`);
						}}
					>
						<DropdownMenuLabel className="text-foreground/60 text-xs">
							{t("organizations.organizationSelect.organizations")}
						</DropdownMenuLabel>
						{allOrganizations?.map((organization) => (
							<DropdownMenuRadioItem
								key={organization.slug}
								className="flex cursor-pointer items-center justify-center gap-2 pl-3"
								value={organization.slug}
							>
								<div className="flex flex-1 items-center justify-start gap-2">
									<OrganizationLogo
										className="size-8"
										logoUrl={organization.logo}
										name={organization.name}
									/>
									{organization.name}
								</div>
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>

					{config.organizations.enableUsersToCreateOrganizations ? (
						<DropdownMenuGroup>
							<DropdownMenuItem
								asChild
								className="cursor-pointer text-primary! text-sm"
							>
								<Link href="/app/new-organization">
									<PlusIcon className="mr-2 size-6 rounded-md bg-primary/20 p-1" />
									{t("organizations.organizationSelect.createNewOrganization")}
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
