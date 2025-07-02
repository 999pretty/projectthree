import type { Metadata } from "next";

import type { PropsWithChildren } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { config } from "@repo/config";

import "./globals.css";
import "cropperjs/dist/cropper.css";

export const metadata: Metadata = {
	title: {
		absolute: config.appName,
		default: config.appName,
		template: `%s | ${config.appName}`,
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body>
				{children}
				<SpeedInsights />
			</body>
		</html>
	);
}
