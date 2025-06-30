"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { HardDriveIcon, MoonIcon, SunIcon } from "lucide-react";
import { useIsClient } from "usehooks-ts";

import { Button } from "@ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";

export const ThemeModeToggle = () => {
	const { resolvedTheme, setTheme, theme } = useTheme();
	const [value, setValue] = useState<string>(theme ?? "system");
	const isClient = useIsClient();

	const themeModeOptions = [
		{
			value: "system",
			label: "System",
			icon: HardDriveIcon,
		},
		{
			value: "light",
			label: "Light",
			icon: SunIcon,
		},
		{
			value: "dark",
			label: "Dark",
			icon: MoonIcon,
		},
	];

	if (!isClient) {
		return null;
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="Theme mode"
					className="cursor-pointer"
					data-test="color-mode-toggle"
					size="icon"
					variant="ghost"
				>
					{resolvedTheme === "light" ? (
						<SunIcon className="size-4" />
					) : (
						<MoonIcon className="size-4" />
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(value) => {
						setTheme(value);
						setValue(value);
					}}
				>
					{themeModeOptions.map((option) => (
						<DropdownMenuRadioItem
							key={option.value}
							className="cursor-pointer"
							data-test={`color-mode-toggle-item-${option.value}`}
							value={option.value}
						>
							<option.icon className="mr-2 size-4 opacity-50" /> {option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
