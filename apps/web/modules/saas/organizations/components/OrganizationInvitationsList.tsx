"use client";

import { useMemo, useCallback } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
	CheckIcon,
	ClockIcon,
	MailXIcon,
	MoreVerticalIcon,
	XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import type { ActiveOrganization } from "@repo/auth";
import { authClient } from "@repo/auth/client";
import { isOrganizationAdmin } from "@repo/auth/lib/helper";
import { useSession } from "@saas/auth/hooks/use-session";
import {
	fullOrganizationQueryKey,
	useFullOrganizationQuery,
} from "@saas/organizations/lib/api";
import { Button } from "@ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@ui/components/table";
import { cn } from "@ui/lib";

import { OrganizationRoleSelect } from "./OrganizationRoleSelect";

type InvitationEmailCellProps = {
	invitation: {
		email: string;
		status: string;
		expiresAt: Date;
	};
};

const InvitationEmailCell = ({
	invitation,
}: Readonly<InvitationEmailCellProps>) => {
	const t = useTranslations();
	const formatter = useFormatter();

	const InvitationStatusIcon =
		{
			pending: ClockIcon,
			accepted: CheckIcon,
			rejected: XIcon,
			canceled: XIcon,
		}[invitation.status] ?? ClockIcon;

	return (
		<div className="leading-normal">
			<strong
				className={cn("block", {
					"opacity-50": invitation.status === "canceled",
				})}
			>
				{invitation.email}
			</strong>
			<small className="flex flex-wrap gap-1 text-foreground/60">
				<span className="flex items-center gap-0.5">
					<InvitationStatusIcon className="size-3" />
					{t(
						`organizations.settings.members.invitations.invitationStatus.${invitation.status}`,
					)}
				</span>
				<span>-</span>
				<span>
					{t("organizations.settings.members.invitations.expiresAt", {
						date: formatter.dateTime(invitation.expiresAt, {
							dateStyle: "medium",
							timeStyle: "short",
						}),
					})}
				</span>
			</small>
		</div>
	);
};

type InvitationActionsCellProps = {
	invitation: {
		id: string;
		role: "admin" | "member" | "owner";
		status: string;
	};
	canUserEditInvitations: boolean;
	onRevokeInvitation: (invitationId: string) => void;
};

const InvitationActionsCell = ({
	invitation,
	canUserEditInvitations,
	onRevokeInvitation,
}: Readonly<InvitationActionsCellProps>) => {
	const t = useTranslations();
	const isPending = invitation.status === "pending";

	return (
		<div className="flex flex-row justify-end gap-2">
			<OrganizationRoleSelect
				disabled
				value={invitation.role}
				onSelect={() => {
					return;
				}}
			/>

			{canUserEditInvitations ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="icon" variant="ghost">
							<MoreVerticalIcon className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							disabled={!isPending}
							onClick={() => onRevokeInvitation(invitation.id)}
						>
							<MailXIcon className="mr-2 size-4" />
							{t("organizations.settings.members.invitations.revoke")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : null}
		</div>
	);
};

function createColumns(
	canUserEditInvitations: boolean,
	onRevokeInvitation: (invitationId: string) => void,
): ColumnDef<NonNullable<ActiveOrganization["invitations"]>[number]>[] {
	return [
		{
			accessorKey: "email",
			accessorFn: (row) => row.email,
			cell: ({ row }) => <InvitationEmailCell invitation={row.original} />,
		},
		{
			accessorKey: "actions",
			cell: ({ row }) => (
				<InvitationActionsCell
					canUserEditInvitations={canUserEditInvitations}
					invitation={row.original}
					onRevokeInvitation={onRevokeInvitation}
				/>
			),
		},
	];
}

export const OrganizationInvitationsList = ({
	organizationId,
}: Readonly<{
	organizationId: string;
}>) => {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const { user } = useSession();
	const { data: organization } = useFullOrganizationQuery(organizationId);

	const canUserEditInvitations = isOrganizationAdmin(organization, user);

	const invitations = useMemo(
		() =>
			organization?.invitations
				?.filter((invitation) => invitation.status === "pending")
				.sort(
					(a, b) =>
						new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
				),
		[organization?.invitations],
	);

	const revokeInvitation = useCallback(
		(invitationId: string) => {
			toast.promise(
				async () => {
					const { error } = await authClient.organization.cancelInvitation({
						invitationId,
					});

					if (error) {
						throw error;
					}
				},
				{
					loading: t(
						"organizations.settings.members.notifications.revokeInvitation.loading.description",
					),
					success: () => {
						queryClient.invalidateQueries({
							queryKey: fullOrganizationQueryKey(organizationId),
						});
						return t(
							"organizations.settings.members.notifications.revokeInvitation.success.description",
						);
					},
					error: t(
						"organizations.settings.members.notifications.revokeInvitation.error.description",
					),
				},
			);
		},
		[organizationId, queryClient, t],
	);

	const columns = useMemo(
		() => createColumns(canUserEditInvitations, revokeInvitation),
		[canUserEditInvitations, revokeInvitation],
	);

	const table = useReactTable({
		data: invitations ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className="rounded-md border">
			<Table>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell className="h-24 text-center" colSpan={columns.length}>
								{t("organizations.settings.members.invitations.empty")}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};
