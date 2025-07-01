"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@ui/lib";

export const SettingsMenu = ({
	menuItems,
}: Readonly<{
	menuItems: {
		title: string;
		avatar: ReactNode;
		items: {
			title: string;
			href: string;
			icon?: ReactNode;
		}[];
	}[];
}>) => {
	const pathname = usePathname();

	const isActiveMenuItem = (href: string) => pathname.includes(href);

	return (
		<div className="space-y-8">
			{menuItems.map((item) => (
				<div key={item.title} className="space-y-4">
					<h2 className="font-medium text-lg">{item.title}</h2>
					<div className="grid gap-1">
						{item.items.map((subitem) => (
							<Link
								key={subitem.href}
								className={cn(
									"block rounded-lg px-3 py-2 font-medium text-sm hover:bg-accent hover:text-accent-foreground",
									isActiveMenuItem(subitem.href) ? "bg-accent" : "",
								)}
								href={subitem.href}
							>
								{subitem.title}
							</Link>
						))}
					</div>
				</div>
			))}
		</div>
	);
};
