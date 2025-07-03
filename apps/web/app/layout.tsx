import type { Metadata } from "next";

import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { config } from "@repo/config";
import { cn } from "@ui/lib";
import { Providers } from "@shared/components/Providers";

import "./globals.css";
import "cropperjs/dist/cropper.css";

export const metadata: Metadata = {
	title: {
		absolute: config.appName,
		default: config.appName,
		template: `%s | ${config.appName}`,
	},
};

export default async function RootLayout({ children }: PropsWithChildren) {
	const cookieStore = await cookies();
	const consentCookie = cookieStore.get("consent");

	return (
		<html suppressHydrationWarning className="font-plex" lang="en">
			<body
				className={cn("min-h-screen bg-background text-foreground antialiased")}
			>
				<Providers initialConsent={consentCookie?.value === "true"}>
					{children}
				</Providers>
				<SpeedInsights />
			</body>
		</html>
	);
}
