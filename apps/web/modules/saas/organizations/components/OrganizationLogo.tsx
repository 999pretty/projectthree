"use client";

import { forwardRef, useMemo } from "react";
import BoringAvatar from "boring-avatars";
import { useIsClient } from "usehooks-ts";

import { config } from "@repo/config";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";

export const OrganizationLogo = forwardRef<
	HTMLSpanElement,
	{
		name: string;
		logoUrl?: string | null;
		className?: string;
	}
>(({ name, logoUrl, className }, ref) => {
	const isClient = useIsClient();
	const avatarColors = useMemo(() => {
		if (typeof window === "undefined") {
			return [];
		}

		const styles = getComputedStyle(window.document.documentElement);
		return [
			styles.getPropertyValue("--color-primary"),
			styles.getPropertyValue("--color-accent"),
			styles.getPropertyValue("--color-highlight"),
		];
	}, []);

	const logoSrc = useMemo(() => {
		if (!logoUrl) {
			return undefined;
		}

		if (logoUrl.startsWith("http")) {
			return logoUrl;
		}

		return `/image-proxy/${config.storage.bucketNames.avatars}/${logoUrl}`;
	}, [logoUrl]);

	if (!isClient) {
		return null;
	}

	return (
		<Avatar ref={ref} className={className}>
			<AvatarImage src={logoSrc} />
			<AvatarFallback>
				<BoringAvatar
					square
					colors={avatarColors}
					name={name}
					size={96}
					variant="sunset"
				/>
			</AvatarFallback>
		</Avatar>
	);
});

OrganizationLogo.displayName = "OrganizationLogo";
