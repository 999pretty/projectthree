"use client";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { authClient } from "@repo/auth/client";
import { Progress } from "@ui/components/progress";
import { useRouter } from "@shared/hooks/router";
import { clearCache } from "@shared/lib/cache";

import { OnboardingStep1 } from "./OnboardingStep1";

export const OnboardingForm = () => {
	const t = useTranslations();
	const router = useRouter();
	const searchParams = useSearchParams();

	const stepSearchParam = searchParams.get("step");
	const redirectTo = searchParams.get("redirectTo");
	const onboardingStep = stepSearchParam
		? Number.parseInt(stepSearchParam, 10)
		: 1;

	const onCompleted = async () => {
		await authClient.updateUser({
			onboardingComplete: true,
		});

		await clearCache();
		router.replace(redirectTo ?? "/app");
	};

	const steps = [
		{
			component: <OnboardingStep1 onCompleted={() => onCompleted()} />,
		},
	];

	return (
		<div>
			<h1 className="font-bold text-xl md:text-2xl">{t("onboarding.title")}</h1>
			<p className="mt-2 mb-6 text-foreground/60">{t("onboarding.message")}</p>

			{steps.length > 1 && (
				<div className="mb-6 flex items-center gap-3">
					<Progress
						className="h-2"
						value={(onboardingStep / steps.length) * 100}
					/>
					<span className="shrink-0 text-foreground/60 text-xs">
						{t("onboarding.step", {
							step: onboardingStep,
							total: steps.length,
						})}
					</span>
				</div>
			)}

			{steps[onboardingStep - 1].component}
		</div>
	);
};
