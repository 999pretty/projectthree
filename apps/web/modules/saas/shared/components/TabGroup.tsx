"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export const TabGroup = ({
	items,
	className,
}: Readonly<{
	items: { label: string; href: string; segment: string }[];
	className?: string;
}>) => {
	const selectedSegment = useSelectedLayoutSegment();
	const activeItem = useMemo(() => {
		return items.find((item) => item.segment === selectedSegment);
	}, [items, selectedSegment]);

	return (
		<div className={` flex border-b-2 ${className}`}>
			{items.map((item) => (
				<Link
					key={item.href}
					className={`-mb-0.5 block border-b-2 px-6 py-3 ${
						item === activeItem
							? "border-primary font-bold"
							: "border-transparent"
					}`}
					href={item.href}
				>
					{item.label}
				</Link>
			))}
		</div>
	);
};
