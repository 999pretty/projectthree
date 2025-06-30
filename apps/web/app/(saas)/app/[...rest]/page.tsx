import { notFound } from "next/navigation";

export default async function CatchAll({
	params,
}: {
	params: Promise<{ rest: string[] }>;
}) {
	const resolvedParams = await params;

	// Don't handle organization routes
	if (resolvedParams.rest[1] === "settings") {
		return null;
	}

	notFound();
}
