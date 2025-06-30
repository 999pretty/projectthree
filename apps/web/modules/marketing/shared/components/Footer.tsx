import { LocaleLink } from "@i18n/routing";

import { config } from "@repo/config";
import { Logo } from "@shared/components/Logo";

export const Footer = () => {
	return (
		<footer className="border-t py-8 text-foreground/60 text-sm">
			<div className="container grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<Logo className="opacity-70 grayscale" />
					<p className="mt-3 text-sm opacity-70">
						© {new Date().getFullYear()} {config.appName}.{" "}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<LocaleLink className="block" href="/blog">
						Blog
					</LocaleLink>

					<a className="block" href="#features">
						Features
					</a>

					<a className="block" href="/#pricing">
						Pricing
					</a>
				</div>

				<div className="flex flex-col gap-2">
					<LocaleLink className="block" href="/legal/privacy-policy">
						Privacy policy
					</LocaleLink>

					<LocaleLink className="block" href="/legal/terms">
						Terms and conditions
					</LocaleLink>
				</div>
			</div>
		</footer>
	);
};
