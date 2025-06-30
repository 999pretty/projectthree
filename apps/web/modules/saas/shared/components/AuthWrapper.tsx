import { type PropsWithChildren, Suspense } from "react";
import Link from "next/link";

import { config } from "@repo/config";
import { Footer } from "@saas/shared/components/Footer";
import { cn } from "@ui/lib";
import { LocaleSwitch } from "@shared/components/LocaleSwitch";
import { Logo } from "@shared/components/Logo";
import { ThemeModeToggle } from "@shared/components/ThemeModeToggle";

export const AuthWrapper = ({
	children,
	contentClass,
}: PropsWithChildren<{ contentClass?: string }>) => {
	return (
		<div className="flex min-h-screen w-full py-6">
			<div className="flex w-full flex-col items-center justify-between gap-8">
				<div className="container">
					<div className="flex items-center justify-between">
						<Link className="block" href="/">
							<Logo />
						</Link>

						<div className="flex items-center justify-end gap-2">
							{config.i18n.enabled ? (
								<Suspense>
									<LocaleSwitch withLocaleInUrl={false} />
								</Suspense>
							) : null}
							<ThemeModeToggle />
						</div>
					</div>
				</div>

				<div className="container flex justify-center">
					<main
						className={cn(
							"w-full max-w-md rounded-3xl border bg-card p-6 lg:p-8",
							contentClass,
						)}
					>
						{children}
					</main>
				</div>

				<Footer />
			</div>
		</div>
	);
};
