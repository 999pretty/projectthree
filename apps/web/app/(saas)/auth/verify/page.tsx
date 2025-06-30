import { getTranslations } from "next-intl/server";

import { OtpForm } from "@saas/auth/components/OtpForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("auth.verify.title"),
	};
}

export default function VerifyPage() {
	return <OtpForm />;
}
