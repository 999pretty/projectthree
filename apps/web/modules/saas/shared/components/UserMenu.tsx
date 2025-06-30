"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
	BookIcon,
	HardDriveIcon,
	HomeIcon,
	LogOutIcon,
	MoonIcon,
	MoreVerticalIcon,
	SettingsIcon,
	SunIcon,
} from "lucide-react";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";

import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { useSession } from "@saas/auth/hooks/use-session";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { UserAvatar } from "@shared/components/UserAvatar";
import { clearCache } from "@shared/lib/cache";

export const UserMenu = ({
	showUserName,
}: Readonly<{ showUserName?: boolean }>) => {
	const t = useTranslations();
	const { user } = useSession();
	const { setTheme: setCurrentTheme, theme: currentTheme } = useTheme();
	const [theme, setTheme] = useState<string>(currentTheme ?? "system");

	const themeModeOptions = [
		{
			value: "system",
			label: "System",
			icon: HardDriveIcon,
		},
		{
			value: "light",
			label: "Light",
			icon: SunIcon,
		},
		{
			value: "dark",
			label: "Dark",
			icon: MoonIcon,
		},
	];

	const onLogout = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					await clearCache();
					window.location.href = new URL(
						config.auth.redirectAfterLogout,
						window.location.origin,
					).toString();
				},
			},
		});
	};

	if (!user) {
		return null;
	}

	const { name, email, image } = user;

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					aria-label="User menu"
					className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-primary md:w-[100%+1rem] md:px-2 md:py-1.5 md:hover:bg-primary/5"
					type="button"
				>
					<span className="flex items-center gap-2">
						<UserAvatar avatarUrl={image} name={name ?? ""} />
						{showUserName ? (
							<span className="text-left leading-tight">
								<span className="font-medium text-sm">{name}</span>
								<span className="block text-xs opacity-70">{email}</span>
							</span>
						) : null}
					</span>

					{showUserName ? <MoreVerticalIcon className="size-4" /> : null}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel>
					{name}
					<span className="block font-normal text-xs opacity-70">{email}</span>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Theme mode selection */}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<SunIcon className="mr-2 size-4" />
						{t("app.userMenu.themeMode")}
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup
								value={theme}
								onValueChange={(value) => {
									setTheme(value);
									setCurrentTheme(value);
								}}
							>
								{themeModeOptions.map((option) => (
									<DropdownMenuRadioItem
										key={option.value}
										value={option.value}
									>
										<option.icon className="mr-2 size-4 opacity-50" />
										{option.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href="/app/settings/general">
						<SettingsIcon className="mr-2 size-4" />
						{t("app.userMenu.accountSettings")}
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<a href="https://nextjsproject.dev/docs/nextjs">
						<BookIcon className="mr-2 size-4" />
						{t("app.userMenu.documentation")}
					</a>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href="/">
						<HomeIcon className="mr-2 size-4" />
						{t("app.userMenu.home")}
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={onLogout}>
					<LogOutIcon className="mr-2 size-4" />
					{t("app.userMenu.logout")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
