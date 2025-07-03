"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { Provider as JotaiProvider } from "jotai";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { config } from "@repo/config";
import { Toaster } from "@ui/components/toast";
import { ApiClientProvider } from "@shared/components/ApiClientProvider";
import { ConsentBanner } from "@shared/components/ConsentBanner";
import { ConsentProvider } from "@shared/components/ConsentProvider";

import { AnalyticsWrapper } from "../../analytics/AnalyticsWrapper";

export const Providers = ({
	children,
	initialConsent,
}: PropsWithChildren<{ initialConsent: boolean }>) => {
	return (
		<NuqsAdapter>
			<ConsentProvider initialConsent={initialConsent}>
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
	);
};
