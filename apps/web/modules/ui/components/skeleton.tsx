import { cn } from "@ui/lib";

const Skeleton = ({
	className,
	...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) => {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-primary/10", className)}
			{...props}
		/>
	);
};

export { Skeleton };
