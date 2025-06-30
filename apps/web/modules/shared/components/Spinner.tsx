import { Loader2Icon } from "lucide-react";

import { cn } from "@ui/lib";

export const Spinner = ({ className }: Readonly<{ className?: string }>) => {
	return (
		<Loader2Icon
			className={cn("size-4 animate-spin text-primary", className)}
		/>
	);
};
