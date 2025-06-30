"use client";

import { useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

export const TableOfContents = ({
	items,
}: Readonly<{
	items: { slug: string; content: string; lvl: number }[];
}>) => {
	const t = useTranslations();
	const scrollToSection = useCallback((id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	}, []);

	useEffect(() => {
		if (location.hash) {
			scrollToSection(location.hash.substring(1));
		}
	}, [scrollToSection]);

	return (
		<div className="w-full max-w-64 self-start rounded-lg border p-4">
			<h3 className="mb-2 font-semibold text-base">
				{t("common.tableOfContents.title")}
			</h3>
			<nav className="list-none space-y-2">
				{items.map((item) => (
					<a
						key={item.slug}
						className={`block text-sm ml-${Math.max(0, item.lvl - 2) * 2}`}
						href={`#${item.slug}`}
						onClick={(e) => {
							e.preventDefault();
							scrollToSection(item.slug);
						}}
					>
						{item.content}
					</a>
				))}
			</nav>
		</div>
	);
};
