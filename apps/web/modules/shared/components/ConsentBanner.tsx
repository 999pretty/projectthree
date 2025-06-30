"use client";

import { useEffect, useState } from "react";
import { CookieIcon } from "lucide-react";

import { Button } from "@ui/components/button";
import { useCookieConsent } from "@shared/hooks/cookie-consent";

export const ConsentBanner = () => {
	const { userHasConsented, allowCookies, declineCookies } =
		useCookieConsent();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	if (userHasConsented) {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-4 z-50 max-w-md">
			<div className="flex gap-4 rounded-2xl border bg-card p-4 text-card-foreground shadow-xl">
				<CookieIcon className="mt-1 block size-6 shrink-0 text-5xl text-primary/60" />
				<div>
					<p className="text-sm leading-normal">
						This site doesn&apos;t use cookies yet, but we added
						this banner to demo it to you.
					</p>
					<div className="mt-4 flex gap-2">
						<Button
							className="flex-1"
							variant="light"
							onClick={() => declineCookies()}
						>
							Decline
						</Button>
						<Button
							className="flex-1"
							onClick={() => allowCookies()}
						>
							Allow
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
