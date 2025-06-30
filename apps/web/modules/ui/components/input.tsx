import React from "react";

import { cn } from "@ui/lib";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={cn(
					"flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-foreground/60 focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				type={type}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
