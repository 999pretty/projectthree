"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { EditIcon, MoreVerticalIcon, PlusIcon, TrashIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { withQuery } from "ufo";
import { useDebounceValue } from "usehooks-ts";
import { useQueryClient } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { authClient } from "@repo/auth/client";
import {
	adminOrganizationsQueryKey,
	useAdminOrganizationsQuery,
} from "@saas/admin/lib/api";
import { getAdminPath } from "@saas/admin/lib/links";
import { OrganizationLogo } from "@saas/organizations/components/OrganizationLogo";
import { useConfirmationAlert } from "@saas/shared/components/ConfirmationAlertProvider";
import { Pagination } from "@saas/shared/components/Pagination";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import { Table, TableBody, TableCell, TableRow } from "@ui/components/table";
import { Spinner } from "@shared/components/Spinner";

const ITEMS_PER_PAGE = 10;

function createDeleteOrganization(
	t: (key: string) => string,
	queryClient: ReturnType<typeof useQueryClient>,
) {
	return async (id: string) => {
		toast.promise(
			async () => {
				const { error } = await authClient.organization.delete({
					organizationId: id,
				});

				if (error) {
					throw error;
				}
			},
			{
				loading: t("admin.organizations.deleteOrganization.deleting"),
				success: () => {
					queryClient.invalidateQueries({
						queryKey: adminOrganizationsQueryKey,
					});
					return t("admin.organizations.deleteOrganization.deleted");
				},
				error: t("admin.organizations.deleteOrganization.notDeleted"),
			},
		);
	};
}

type OrganizationNameCellProps = {
	id: string;
	name: string;
	logo: string | null;
	membersCount: number;
	getOrganizationEditPath: (id: string) => string;
};

const OrganizationNameCell = ({
	id,
	name,
	logo,
	membersCount,
	getOrganizationEditPath,
}: Readonly<OrganizationNameCellProps>) => {
	const t = useTranslations();

	return (
		<div className="flex items-center gap-2">
			<OrganizationLogo logoUrl={logo} name={name} />
			<div className="leading-tight">
				<Link className="block font-bold" href={getOrganizationEditPath(id)}>
					{name}
				</Link>
				<small>
					{t("admin.organizations.membersCount", {
						count: membersCount,
					})}
				</small>
			</div>
		</div>
	);
};

type OrganizationActionsCellProps = {
	id: string;
	getOrganizationEditPath: (id: string) => string;
	onDelete: (id: string) => void;
};

const OrganizationActionsCell = ({
	id,
	getOrganizationEditPath,
	onDelete,
}: Readonly<OrganizationActionsCellProps>) => {
	const t = useTranslations();
	const { confirm } = useConfirmationAlert();

	return (
		<div className="flex flex-row justify-end gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost">
						<MoreVerticalIcon className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem asChild>
						<Link
							className="flex items-center"
							href={getOrganizationEditPath(id)}
						>
							<EditIcon className="mr-2 size-4" />
							{t("admin.organizations.edit")}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							confirm({
								title: t("admin.organizations.confirmDelete.title"),
								message: t("admin.organizations.confirmDelete.message"),
								confirmLabel: t("admin.organizations.confirmDelete.confirm"),
								destructive: true,
								onConfirm: () => onDelete(id),
							})
						}
					>
						<span className="flex items-center text-destructive hover:text-destructive">
							<TrashIcon className="mr-2 size-4" />
							{t("admin.organizations.delete")}
						</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

function createColumns(
	getOrganizationEditPath: (id: string) => string,
	deleteOrganization: (id: string) => Promise<void>,
): ColumnDef<NonNullable<any>["organizations"][number]>[] {
	return [
		{
			accessorKey: "user",
			header: "",
			accessorFn: (row) => row.name,
			cell: ({
				row: {
					original: { id, name, logo, membersCount },
				},
			}) => (
				<OrganizationNameCell
					getOrganizationEditPath={getOrganizationEditPath}
					id={id}
					logo={logo}
					membersCount={membersCount}
					name={name}
				/>
			),
		},
		{
			accessorKey: "actions",
			header: "",
			cell: ({
				row: {
					original: { id },
				},
			}) => (
				<OrganizationActionsCell
					getOrganizationEditPath={getOrganizationEditPath}
					id={id}
					onDelete={deleteOrganization}
				/>
			),
		},
	];
}

export const OrganizationList = () => {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useQueryState(
		"currentPage",
		parseAsInteger.withDefault(1),
	);
	const [searchTerm, setSearchTerm] = useQueryState(
		"query",
		parseAsString.withDefault(""),
	);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounceValue(
		searchTerm,
		300,
		{
			leading: true,
			trailing: false,
		},
	);

	useEffect(() => {
		setDebouncedSearchTerm(searchTerm);
	}, [searchTerm, setDebouncedSearchTerm]);

	const { data, isLoading } = useAdminOrganizationsQuery({
		itemsPerPage: ITEMS_PER_PAGE,
		currentPage,
		searchTerm: debouncedSearchTerm,
	});

	useEffect(() => {
		setCurrentPage(1);
	}, [setCurrentPage]);

	const getPathWithBackToParemeter = useMemo(
		() => (path: string) => {
			const searchParams = new URLSearchParams(window.location.search);
			const searchQuery = searchParams.size
				? `?${searchParams.toString()}`
				: "";
			const backToPath = `${window.location.pathname}${searchQuery}`;

			return withQuery(path, {
				backTo: backToPath,
			});
		},
		[],
	);

	const getOrganizationEditPath = useMemo(
		() => (id: string) => {
			return getPathWithBackToParemeter(getAdminPath(`/organizations/${id}`));
		},
		[getPathWithBackToParemeter],
	);

	const deleteOrganization = useMemo(
		() => createDeleteOrganization(t, queryClient),
		[t, queryClient],
	);

	const columns = useMemo(
		() => createColumns(getOrganizationEditPath, deleteOrganization),
		[getOrganizationEditPath, deleteOrganization],
	);

	const organizations = useMemo(
		() => data?.organizations ?? [],
		[data?.organizations],
	);

	const table = useReactTable({
		data: organizations,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
	});

	return (
		<Card className="p-6">
			<div className="mb-4 flex items-center justify-between gap-6">
				<h2 className="font-semibold text-2xl">
					{t("admin.organizations.title")}
				</h2>

				<Button asChild>
					<Link href={getAdminPath("/organizations/new")}>
						<PlusIcon className="mr-1.5 size-4" />
						{t("admin.organizations.create")}
					</Link>
				</Button>
			</div>
			<Input
				className="mb-4"
				placeholder={t("admin.organizations.search")}
				type="search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			<div className="rounded-md border">
				<Table>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="group"
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="py-2 group-first:rounded-t-md group-last:rounded-b-md"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									className="h-24 text-center"
									colSpan={columns.length}
								>
									{isLoading ? (
										<div className="flex h-full items-center justify-center">
											<Spinner className="mr-2 size-4 text-primary" />
											{t("admin.organizations.loading")}
										</div>
									) : (
										<p>No results.</p>
									)}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{!!data?.total && data.total > ITEMS_PER_PAGE && (
				<Pagination
					className="mt-4"
					currentPage={currentPage}
					itemsPerPage={ITEMS_PER_PAGE}
					totalItems={data.total}
					onChangeCurrentPage={setCurrentPage}
				/>
			)}
		</Card>
	);
};
