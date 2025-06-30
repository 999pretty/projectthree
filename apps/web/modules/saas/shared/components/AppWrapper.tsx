import type { PropsWithChildren } from "react";

import { config } from "@repo/config";
import { NavBar } from "@saas/shared/components/NavBar";
import { cn } from "@ui/lib";

export const AppWrapper = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<div
			className={cn(
				"bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_95%)_0%,var(--color-background)_50%)] dark:bg-[radial-gradient(farthest-corner_at_0%_0%,color-mix(in_oklch,var(--color-primary),transparent_90%)_0%,var(--color-background)_50%)]",
			)}
		>
			<NavBar />
			<div
				className={cn(" flex py-4 md:pr-4", [
					config.ui.saas.useSidebarLayout
						? "min-h-[calc(100vh)] md:ml-[280px]"
						: "",
				])}
			>
				<main
					className={cn(
						"min-h-full w-full rounded-2xl border bg-card px-4 py-6 md:p-8",
					)}
				>
					<div className="container px-0">{children}</div>
				</main>
			</div>
		</div>
	);
};
