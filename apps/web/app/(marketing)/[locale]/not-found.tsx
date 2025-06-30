import { NotFound } from "@marketing/shared/components/NotFound";

//  : Next.js requires default exports for not-found files
export default async function NotFoundPage() {
	return <NotFound />;
}
