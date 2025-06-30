import type { PropsWithChildren } from "react";
import { Button } from "@react-email/components";

export const PrimaryButton = ({
	href,
	children,
}: PropsWithChildren<{
	href: string;
}>) => {
	return (
		<Button
			className="rounded-full bg-primary px-4 py-2 text-lg text-primary-foreground"
			href={href}
		>
			{children}
		</Button>
	);
};
