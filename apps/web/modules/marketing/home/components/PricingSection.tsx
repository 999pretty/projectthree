"use client";
import { useTranslations } from "next-intl";

import { PricingTable } from "@saas/payments/components/PricingTable";

export const PricingSection = () => {
	const t = useTranslations();

	return (
		<section className="scroll-mt-16 py-12 lg:py-16" id="pricing">
			<div className="container max-w-5xl">
				<div className="mb-6 lg:text-center">
					<h1 className="font-bold text-4xl lg:text-5xl">
						{t("pricing.title")}
					</h1>
					<p className="mt-3 text-lg opacity-50">{t("pricing.description")}</p>
				</div>

				<PricingTable />
			</div>
		</section>
	);
};
