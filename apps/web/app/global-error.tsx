"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

import { cn } from "@ui/lib";
import { Providers } from "@shared/components/Providers";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		// Enhanced error reporting
		Sentry.captureException(error, {
			tags: {
				errorType: "global",
				errorDigest: error.digest,
			},
		});
	}, [error]);

	return (
		<html suppressHydrationWarning className={cn("font-plex")} lang="en">
			<body
				className={cn("min-h-screen bg-background text-foreground antialiased")}
			>
				<Providers initialConsent={false}>
					<div
						className={cn(
							"flex min-h-screen flex-col items-center justify-center",
						)}
					>
						<div
							className={cn("rounded-lg bg-white p-8 text-center shadow-xl")}
						>
							<h1 className={cn("mb-4 font-bold text-2xl text-red-600")}>
								Something went wrong!
							</h1>
							<p className={cn("mb-4 text-gray-600")}>
								We&apos;ve been notified and are looking into it.
								{error.digest ? (
									<span className={cn("mt-2 block text-gray-500 text-sm")}>
										Error ID: {error.digest}
									</span>
								) : null}
							</p>
							<div className={cn("flex flex-col gap-2")}>
								<button
									className={cn(
										"rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600",
									)}
									type="button"
									onClick={() => reset()}
								>
									Try again
								</button>
								<button
									className={cn(
										"rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300",
									)}
									type="button"
									onClick={() => router.push("/")}
								>
									Return to homepage
								</button>
							</div>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
