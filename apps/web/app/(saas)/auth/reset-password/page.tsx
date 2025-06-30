import { getTranslations } from "next-intl/server";

import { ResetPasswordForm } from "@saas/auth/components/ResetPasswordForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("auth.resetPassword.title"),
	};
}

export default function ResetPasswordPage() {
	return <ResetPasswordForm />;
}
