import { LocaleLink } from "@i18n/routing";

import { cn } from "@ui/lib";

export const Footer = () => {
	return (
		<footer
			className={cn(
				"container max-w-6xl py-6 text-center text-foreground/60 text-xs",
			)}
		>
			<span>
				<a href="https://nextjs.org">Built with Next.js</a>
			</span>
			<span className="opacity-50"> | </span>
			<LocaleLink href="/legal/privacy-policy">Privacy policy</LocaleLink>
			<span className="opacity-50"> | </span>
			<LocaleLink href="/legal/terms">Terms and conditions</LocaleLink>
		</footer>
	);
};
