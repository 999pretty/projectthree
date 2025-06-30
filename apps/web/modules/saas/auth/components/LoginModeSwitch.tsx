"use client";

import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";

export const LoginModeSwitch = ({
	activeMode,
	onChange,
	className,
}: Readonly<{
	activeMode: "password" | "magic-link";
	onChange: (mode: string) => void;
	className?: string;
}>) => {
	const t = useTranslations();
	return (
		<Tabs className={className} value={activeMode} onValueChange={onChange}>
			<TabsList className="w-full">
				<TabsTrigger className="flex-1" value="password">
					{t("auth.login.modes.password")}
				</TabsTrigger>
				<TabsTrigger className="flex-1" value="magic-link">
					{t("auth.login.modes.magicLink")}
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
};
