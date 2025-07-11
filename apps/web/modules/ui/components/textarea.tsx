import * as React from "react";

import { cn } from "@ui/lib";

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
	return (
		<textarea
			ref={ref}
			className={cn(
				"flex min-h-[80px] w-full rounded-md border border-input bg-card px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			{...props}
		/>
	);
});
Textarea.displayName = "Textarea";

export { Textarea };
