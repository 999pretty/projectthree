"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { LanguagesIcon } from "lucide-react";
import { updateLocale } from "@i18n/lib/update-locale";
import { useLocalePathname, useLocaleRouter } from "@i18n/routing";

import { config } from "@repo/config";
import type { Locale } from "@repo/i18n";
import { Button } from "@ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";

const { locales } = config.i18n;

export const LocaleSwitch = ({
	withLocaleInUrl = true,
}: Readonly<{
	withLocaleInUrl?: boolean;
}>) => {
	const localeRouter = useLocaleRouter();
	const localePathname = useLocalePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentLocale = useLocale();
	const [value, setValue] = useState<string>(currentLocale);

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="Language"
					className="cursor-pointer"
					size="icon"
					variant="ghost"
				>
					<LanguagesIcon className="size-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(value) => {
						setValue(value);

						if (withLocaleInUrl) {
							localeRouter.replace(
								`/${localePathname}?${searchParams.toString()}`,
								{
									locale: value,
								},
							);
						} else {
							updateLocale(value as Locale);
							router.refresh();
						}
					}}
				>
					{Object.entries(locales).map(([locale, { label }]) => {
						return (
							<DropdownMenuRadioItem
								key={locale}
								className="cursor-pointer"
								value={locale}
							>
								{label}
							</DropdownMenuRadioItem>
						);
					})}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
