"use client";

import React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "./input";

export const PasswordInput = ({
	value,
	onChange,
	className,
	autoComplete,
}: Readonly<{
	value: string;
	onChange: (value: string) => void;
	className?: string;
	autoComplete?: string;
}>) => {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className={`relative ${className}`}>
			<Input
				autoComplete={autoComplete}
				className="pr-10"
				type={showPassword ? "text" : "password"}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			<button
				className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary text-xl"
				type="button"
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? (
					<EyeOffIcon className="size-4" />
				) : (
					<EyeIcon className="size-4" />
				)}
			</button>
		</div>
	);
};
