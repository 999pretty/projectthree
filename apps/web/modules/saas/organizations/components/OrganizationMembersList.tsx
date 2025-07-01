"use client";

import { useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { LogOutIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
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
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
} from "@tanstack/react-table";

import type { OrganizationMemberRole } from "@repo/auth";
import { authClient } from "@repo/auth/client";
import { isOrganizationAdmin } from "@repo/auth/lib/helper";
import { useSession } from "@saas/auth/hooks/use-session";
import { useOrganizationMemberRoles } from "@saas/organizations/hooks/member-roles";
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
import { UserAvatar } from "@shared/components/UserAvatar";

import { OrganizationRoleSelect } from "./OrganizationRoleSelect";

type MemberUserCellProps = {
	member: {
		user: {
			name: string | null;
			email: string;
			image?: string;
		} | null;
	};
};

const MemberUserCell = ({ member }: Readonly<MemberUserCellProps>) => {
	if (!member.user) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			<UserAvatar
				avatarUrl={member.user?.image ?? null}
				name={member.user.name ?? member.user.email}
			/>
			<div>
				<strong className="block">{member.user.name}</strong>
				<small className="text-foreground/60">{member.user.email}</small>
			</div>
		</div>
	);
};

type MemberActionsCellProps = {
	member: {
		id: string;
		role: "member" | "admin" | "owner";
		userId: string;
	};
	userIsOrganizationAdmin: boolean;
	organization: any;
	user: any;
	memberRoles: any;
	onUpdateMemberRole: (memberId: string, role: any) => Promise<void>;
	onRemoveMember: (memberId: string) => Promise<void>;
};

const MemberActionsCell = ({
	member,
	userIsOrganizationAdmin,
	organization,
	user,
	memberRoles,
	onUpdateMemberRole,
	onRemoveMember,
}: Readonly<MemberActionsCellProps>) => {
	const t = useTranslations();

	return (
		<div className="flex flex-row justify-end gap-2">
			{userIsOrganizationAdmin ? (
				<>
					<OrganizationRoleSelect
						disabled={!userIsOrganizationAdmin || member.role === "owner"}
						value={member.role}
						onSelect={async (value) => onUpdateMemberRole(member.id, value)}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<MoreVerticalIcon className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{member.userId !== user?.id && (
								<DropdownMenuItem
									className="text-destructive"
									disabled={!isOrganizationAdmin(organization, user)}
									onClick={async () => onRemoveMember(member.id)}
								>
									<TrashIcon className="mr-2 size-4" />
									{t("organizations.settings.members.removeMember")}
								</DropdownMenuItem>
							)}
							{member.userId === user?.id && (
								<DropdownMenuItem
									className="text-destructive"
									onClick={async () => onRemoveMember(member.id)}
								>
									<LogOutIcon className="mr-2 size-4" />
									{t("organizations.settings.members.leaveOrganization")}
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			) : (
				<span className="font-medium text-foreground/60 text-sm">
					{memberRoles[member.role as keyof typeof memberRoles]}
				</span>
			)}
		</div>
	);
};

function createColumns(
	userIsOrganizationAdmin: boolean,
	organization: any,
	user: any,
	memberRoles: any,
	onUpdateMemberRole: (memberId: string, role: any) => Promise<void>,
	onRemoveMember: (memberId: string) => Promise<void>,
): ColumnDef<NonNullable<any>["members"][number]>[] {
	return [
		{
			accessorKey: "user",
			header: "",
			accessorFn: (row) => row.user,
			cell: ({ row }) => <MemberUserCell member={row.original} />,
		},
		{
			accessorKey: "actions",
			header: "",
			cell: ({ row }) => (
				<MemberActionsCell
					member={row.original}
					memberRoles={memberRoles}
					organization={organization}
					user={user}
					userIsOrganizationAdmin={userIsOrganizationAdmin}
					onRemoveMember={onRemoveMember}
					onUpdateMemberRole={onUpdateMemberRole}
				/>
			),
		},
	];
}

export const OrganizationMembersList = ({
	organizationId,
}: Readonly<{
	organizationId: string;
}>) => {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const { user } = useSession();
	const { data: organization } = useFullOrganizationQuery(organizationId);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const memberRoles = useOrganizationMemberRoles();

	const userIsOrganizationAdmin = isOrganizationAdmin(organization, user);

	const updateMemberRole = useCallback(
		async (memberId: string, role: OrganizationMemberRole) => {
			toast.promise(
				async () => {
					await authClient.organization.updateMemberRole({
						memberId,
						role,
						organizationId,
					});
				},
				{
					loading: t(
						"organizations.settings.members.notifications.updateMembership.loading.description",
					),
					success: () => {
						queryClient.invalidateQueries({
							queryKey: fullOrganizationQueryKey(organizationId),
						});

						return t(
							"organizations.settings.members.notifications.updateMembership.success.description",
						);
					},
					error: t(
						"organizations.settings.members.notifications.updateMembership.error.description",
					),
				},
			);
		},
		[organizationId, queryClient, t],
	);

	const removeMember = useCallback(
		async (memberId: string) => {
			toast.promise(
				async () => {
					await authClient.organization.removeMember({
						memberIdOrEmail: memberId,
						organizationId,
					});
				},
				{
					loading: t(
						"organizations.settings.members.notifications.removeMember.loading.description",
					),
					success: () => {
						queryClient.invalidateQueries({
							queryKey: fullOrganizationQueryKey(organizationId),
						});

						return t(
							"organizations.settings.members.notifications.removeMember.success.description",
						);
					},
					error: t(
						"organizations.settings.members.notifications.removeMember.error.description",
					),
				},
			);
		},
		[organizationId, queryClient, t],
	);

	const columns = useMemo(
		() =>
			createColumns(
				userIsOrganizationAdmin,
				organization,
				user,
				memberRoles,
				updateMemberRole,
				removeMember,
			),
		[
			userIsOrganizationAdmin,
			organization,
			user,
			memberRoles,
			updateMemberRole,
			removeMember,
		],
	);

	const table = useReactTable({
		data: organization?.members ?? [],
		columns,
		manualPagination: true,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
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
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};
