"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
	MoreVerticalIcon,
	Repeat1Icon,
	ShieldCheckIcon,
	ShieldXIcon,
	SquareUserRoundIcon,
	TrashIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { authClient } from "@repo/auth/client";
import { useAdminUsersQuery } from "@saas/admin/lib/api";
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
import { UserAvatar } from "@shared/components/UserAvatar";

import { EmailVerified } from "../EmailVerified";

const ITEMS_PER_PAGE = 10;

type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	role: string | null;
	createdAt: string;
	updatedAt: string;
};

type UserNameCellProps = {
	user: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
		emailVerified: boolean;
		role: string | null;
	};
};

const UserNameCell = ({ user }: Readonly<UserNameCellProps>) => {
	return (
		<div className="flex items-center gap-2">
			<UserAvatar avatarUrl={user.image} name={user.name ?? user.email} />
			<div className="leading-tight">
				<strong className="block">{user.name ?? user.email}</strong>
				<small className="flex items-center gap-1 text-foreground/60">
					<span className="block">{!!user.name && user.email}</span>
					<EmailVerified verified={user.emailVerified} />
					<strong className="block">
						{user.role === "admin" ? "Admin" : ""}
					</strong>
				</small>
			</div>
		</div>
	);
};

type UserActionsCellProps = {
	user: {
		id: string;
		name: string | null;
		email: string;
		emailVerified: boolean;
		role: string | null;
	};
	onImpersonate: (userId: string) => Promise<void>;
	onResendVerification: (userId: string) => Promise<void>;
	onAssignAdmin: (userId: string) => Promise<void>;
	onRemoveAdmin: (userId: string) => Promise<void>;
	onDelete: (userId: string) => Promise<void>;
};

const UserActionsCell = ({
	user,
	onImpersonate,
	onResendVerification,
	onAssignAdmin,
	onRemoveAdmin,
	onDelete,
}: Readonly<UserActionsCellProps>) => {
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
					<DropdownMenuItem onClick={() => onImpersonate(user.id)}>
						<SquareUserRoundIcon className="mr-2 size-4" />
						{t("admin.users.impersonate")}
					</DropdownMenuItem>

					{!user.emailVerified && (
						<DropdownMenuItem onClick={() => onResendVerification(user.id)}>
							<Repeat1Icon className="mr-2 size-4" />
							{t("admin.users.resendVerificationMail.title")}
						</DropdownMenuItem>
					)}

					{user.role !== "admin" ? (
						<DropdownMenuItem onClick={() => onAssignAdmin(user.id)}>
							<ShieldCheckIcon className="mr-2 size-4" />
							{t("admin.users.assignAdminRole")}
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={() => onRemoveAdmin(user.id)}>
							<ShieldXIcon className="mr-2 size-4" />
							{t("admin.users.removeAdminRole")}
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						onClick={() =>
							confirm({
								title: t("admin.users.confirmDelete.title"),
								message: t("admin.users.confirmDelete.message"),
								confirmLabel: t("admin.users.confirmDelete.confirm"),
								destructive: true,
								onConfirm: () => onDelete(user.id),
							})
						}
					>
						<span className="flex items-center text-destructive hover:text-destructive">
							<TrashIcon className="mr-2 size-4" />
							{t("admin.users.delete")}
						</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export const UserList = () => {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	useEffect(() => {
		setCurrentPage(1);
	}, []);

	const { data, isLoading } = useAdminUsersQuery({
		itemsPerPage: ITEMS_PER_PAGE,
		currentPage,
		searchTerm: debouncedSearchTerm,
	});

	const impersonateUser = useCallback(
		async (userId: string) => {
			const { error } = await authClient.admin.impersonateUser({
				userId,
			});

			if (error) {
				toast.error(t("admin.users.notifications.error.impersonate"));
				return;
			}

			window.location.href = "/app";
		},
		[t],
	);

	const deleteUser = useCallback(
		async (userId: string) => {
			const { error } = await authClient.admin.removeUser({
				userId,
			});

			if (error) {
				toast.error(t("admin.users.notifications.error.delete"));
				return;
			}

			queryClient.invalidateQueries({
				queryKey: ["admin", "users"],
			});

			toast.success(t("admin.users.notifications.success.delete"));
		},
		[queryClient, t],
	);

	const resendVerificationMail = useCallback(
		async (_userId: string) => {
			// Note: Better Auth doesn't seem to have a direct resend verification method in admin
			// This might need to be implemented differently or use a different approach
			console.warn("Resend verification not implemented for better-auth admin");
			toast.error(t("admin.users.notifications.error.resendVerification"));
		},
		[t],
	);

	const assignAdminRole = useCallback(
		async (userId: string) => {
			const { error } = await authClient.admin.setRole({
				userId,
				role: "admin",
			});

			if (error) {
				toast.error(t("admin.users.notifications.error.assignAdmin"));
				return;
			}

			queryClient.invalidateQueries({
				queryKey: ["admin", "users"],
			});

			toast.success(t("admin.users.notifications.success.assignAdmin"));
		},
		[queryClient, t],
	);

	const removeAdminRole = useCallback(
		async (userId: string) => {
			const { error } = await authClient.admin.setRole({
				userId,
				role: "user",
			});

			if (error) {
				toast.error(t("admin.users.notifications.error.removeAdmin"));
				return;
			}

			queryClient.invalidateQueries({
				queryKey: ["admin", "users"],
			});

			toast.success(t("admin.users.notifications.success.removeAdmin"));
		},
		[queryClient, t],
	);

	return (
		<Card className="p-6">
			<h2 className="mb-4 font-semibold text-2xl">{t("admin.users.title")}</h2>
			<Input
				className="mb-4"
				placeholder={t("admin.users.search")}
				type="search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			<div className="rounded-md border">
				<Table>
					<TableBody>
						{(() => {
							if (isLoading) {
								return (
									<TableRow>
										<TableCell className="h-24 text-center" colSpan={3}>
											Loading...
										</TableCell>
									</TableRow>
								);
							}

							if (data?.users.length) {
								return data.users.map((user) => (
									<TableRow
										key={user.id}
										data-state={user.id === "selected" && "selected"}
									>
										<TableCell>
											<UserNameCell user={user} />
										</TableCell>
										<TableCell>{user.role ?? "User"}</TableCell>
										<TableCell>
											<UserActionsCell
												user={user}
												onAssignAdmin={assignAdminRole}
												onDelete={deleteUser}
												onImpersonate={impersonateUser}
												onRemoveAdmin={removeAdminRole}
												onResendVerification={resendVerificationMail}
											/>
										</TableCell>
									</TableRow>
								));
							}

							return (
								<TableRow>
									<TableCell className="h-24 text-center" colSpan={3}>
										No results.
									</TableCell>
								</TableRow>
							);
						})()}
					</TableBody>
				</Table>
			</div>

			{data?.total && data.total > ITEMS_PER_PAGE ? (
				<Pagination
					className="mt-4"
					currentPage={currentPage}
					itemsPerPage={ITEMS_PER_PAGE}
					totalItems={data.total}
					onChangeCurrentPage={setCurrentPage}
				/>
			) : null}
		</Card>
	);
};
