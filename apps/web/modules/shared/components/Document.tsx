import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Provider as JotaiProvider } from "jotai";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { config } from "@repo/config";
import { Toaster } from "@ui/components/toast";
import { cn } from "@ui/lib";
import { ApiClientProvider } from "@shared/components/ApiClientProvider";
import { ConsentBanner } from "@shared/components/ConsentBanner";
import { ConsentProvider } from "@shared/components/ConsentProvider";

import { AnalyticsWrapper } from "../../analytics/AnalyticsWrapper";

export const Document = async ({
	children,
	locale,
}: PropsWithChildren<{ locale: string }>) => {
	const cookieStore = await cookies();
	const consentCookie = cookieStore.get("consent");

	return (
		<html suppressHydrationWarning className="font-plex" lang={locale}>
			<body
				className={cn("min-h-screen bg-background text-foreground antialiased")}
			>
				<NuqsAdapter>
					<ConsentProvider initialConsent={consentCookie?.value === "true"}>
						<NextTopLoader color="var(--color-primary)" />
						<ThemeProvider
							disableTransitionOnChange
							enableSystem
							attribute="class"
							defaultTheme={config.ui.defaultTheme}
							themes={config.ui.enabledThemes}
						>
							<ApiClientProvider>
								<JotaiProvider>{children}</JotaiProvider>
							</ApiClientProvider>
						</ThemeProvider>
						<Toaster position="top-right" />
						<ConsentBanner />
						<AnalyticsWrapper />
					</ConsentProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
};
