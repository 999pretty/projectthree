"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
	error,
	reset,
}: Readonly<{
	error: Error & { digest?: string };
	reset: () => void;
}>) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<div className="flex min-h-screen flex-col items-center justify-center">
					<div className="rounded-lg bg-white p-8 text-center shadow-xl">
						<h1 className="mb-4 font-bold text-2xl text-red-600">
							Something went wrong!
						</h1>
						<p className="mb-4 text-gray-600">
							We&apos;ve been notified and are looking into it.
						</p>
						<button
							className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
							type="button"
							onClick={() => reset()}
						>
							Try again
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
