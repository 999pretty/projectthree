"use client";

import { Suspense, useEffect, useState } from "react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { MenuIcon } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { LocaleLink, useLocalePathname } from "@i18n/routing";

import { config } from "@repo/config";
import { useSession } from "@saas/auth/hooks/use-session";
import { Button } from "@ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@ui/components/sheet";
import { cn } from "@ui/lib";
import { LocaleSwitch } from "@shared/components/LocaleSwitch";
import { Logo } from "@shared/components/Logo";
import { ThemeModeToggle } from "@shared/components/ThemeModeToggle";

const AuthButton = ({ user, t }: { user: any; t: any }) => {
	if (!config.ui.saas.enabled) {
		return null;
	}

	if (user) {
		return (
			<Button
				key="dashboard"
				asChild
				className="hidden lg:flex"
				variant="secondary"
			>
				<NextLink href="/app">{t("common.menu.dashboard")}</NextLink>
			</Button>
		);
	}

	return (
		<Button key="login" asChild className="hidden lg:flex" variant="secondary">
			<NextLink href="/auth/login">{t("common.menu.login")}</NextLink>
		</Button>
	);
};

export const NavBar = () => {
	const t = useTranslations();
	const { user } = useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const localePathname = useLocalePathname();
	const [isTop, setIsTop] = useState(true);

	const debouncedScrollHandler = useDebounceCallback(
		() => {
			setIsTop(window.scrollY <= 10);
		},
		150,
		{
			maxWait: 150,
		},
	);

	useEffect(() => {
		window.addEventListener("scroll", debouncedScrollHandler);
		debouncedScrollHandler();
		return () => {
			window.removeEventListener("scroll", debouncedScrollHandler);
		};
	}, [debouncedScrollHandler]);

	useEffect(() => {
		setMobileMenuOpen(false);
	}, []);

	const isDocsPage = localePathname.startsWith("/docs");

	const menuItems: {
		label: string;
		href: string;
	}[] = [
		{
			label: t("common.menu.pricing"),
			href: "/#pricing",
		},
		{
			label: t("common.menu.faq"),
			href: "/#faq",
		},
		{
			label: t("common.menu.blog"),
			href: "/blog",
		},
		{
			label: t("common.menu.changelog"),
			href: "/changelog",
		},
		...(config.contactForm.enabled
			? [
					{
						label: t("common.menu.contact"),
						href: "/contact",
					},
				]
			: []),
		{
			label: t("common.menu.docs"),
			href: "/docs",
		},
	];

	const isMenuItemActive = (href: string) => localePathname.startsWith(href);

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 z-50 w-full transition-shadow duration-200",
				!isTop || isDocsPage
					? "bg-card/80 shadow-sm backdrop-blur-lg"
					: "shadow-none",
			)}
			data-test="navigation"
		>
			<div className="container">
				<div
					className={cn(
						"flex items-center justify-stretch gap-6 transition-[padding] duration-200",
						!isTop || isDocsPage ? "py-4" : "py-6",
					)}
				>
					<div className="flex flex-1 justify-start">
						<LocaleLink
							className="block hover:no-underline active:no-underline"
							href="/"
						>
							<Logo />
						</LocaleLink>
					</div>

					<div className="hidden flex-1 items-center justify-center lg:flex">
						{menuItems.map((menuItem) => (
							<LocaleLink
								key={menuItem.href}
								className={cn(
									"block cursor-pointer px-3 py-2 font-medium text-foreground/80 text-sm",
									isMenuItemActive(menuItem.href)
										? "font-bold text-foreground"
										: "",
								)}
								href={menuItem.href}
							>
								{menuItem.label}
							</LocaleLink>
						))}
					</div>

					<div className="flex flex-1 items-center justify-end gap-3">
						<ThemeModeToggle />
						{config.i18n.enabled ? (
							<Suspense>
								<LocaleSwitch />
							</Suspense>
						) : null}

						<Sheet
							open={mobileMenuOpen}
							onOpenChange={(open) => setMobileMenuOpen(open)}
						>
							<SheetTrigger asChild>
								<Button
									aria-label="Menu"
									className="lg:hidden"
									size="icon"
									variant="light"
								>
									<MenuIcon className="size-4" />
								</Button>
							</SheetTrigger>
							<SheetContent className="w-[280px]" side="right">
								<SheetTitle />
								<div className="flex flex-col items-start justify-center">
									{menuItems.map((menuItem) => (
										<LocaleLink
											key={menuItem.href}
											className={cn(
												"block cursor-pointer px-3 py-2 font-medium text-base text-foreground/80",
												isMenuItemActive(menuItem.href)
													? "font-bold text-foreground"
													: "",
											)}
											href={menuItem.href}
										>
											{menuItem.label}
										</LocaleLink>
									))}

									<NextLink
										key={user ? "start" : "login"}
										className="block px-3 py-2 text-base"
										href={user ? "/app" : "/auth/login"}
										prefetch={!user}
									>
										{user ? t("common.menu.dashboard") : t("common.menu.login")}
									</NextLink>
								</div>
							</SheetContent>
						</Sheet>

						<AuthButton t={t} user={user} />
					</div>
				</div>
			</div>
		</nav>
	);
};
