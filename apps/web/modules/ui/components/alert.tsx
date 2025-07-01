import type { VariantProps } from "class-variance-authority";

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@ui/lib";

const alertVariants = cva(
	"relative w-full rounded-lg border p-4 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:size-4 [&>svg]:text-foreground [&>svg~*]:pl-6",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				primary:
					"border-primary/20 bg-primary/10 text-primary [&>svg]:text-primary",
				error:
					"border-destructive/20 bg-destructive/10 text-destructive [&>svg]:text-destructive",
				success:
					"border-success/20 bg-success/10 text-success [&>svg]:text-success",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(alertVariants({ variant }), className)}
		role="alert"
		{...props}
	/>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn(
			"font-semibold text-sm leading-tight tracking-tight",
			className,
		)}
		{...props}
	>
		{children}
	</h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("mt-1 text-sm [&_p]:leading-relaxed", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
