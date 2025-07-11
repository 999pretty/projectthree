import { useTranslations } from "next-intl";

import { cn } from "@ui/lib";

export const FaqSection = ({ className }: Readonly<{ className?: string }>) => {
	const t = useTranslations();

	const items = [
		{
			id: "refund-policy",
			question: "What is the refund policy?",
			answer:
				"We offer a 30-day money-back guarantee if you're not happy with our product.",
		},
		{
			id: "cancel-subscription",
			question: "How do I cancel my subscription?",
			answer: "You can cancel your subscription by visiting the billing page.",
		},
		{
			id: "change-plan",
			question: "Can I change my plan?",
			answer:
				"Yes, you can change your plan at any time by visiting the billing page.",
		},
		{
			id: "free-trial",
			question: "Do you offer a free trial?",
			answer: "Yes, we offer a 14-day free trial.",
		},
	];

	if (!items) {
		return null;
	}

	return (
		<section
			className={cn("scroll-mt-20 border-t py-12 lg:py-16", className)}
			id="faq"
		>
			<div className="container max-w-5xl">
				<div className="mb-12 lg:text-center">
					<h1 className="mb-2 font-bold text-4xl lg:text-5xl">
						{t("faq.title")}
					</h1>
					<p className="text-lg opacity-50">{t("faq.description")}</p>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{items.map((item) => (
						<div key={item.id} className="rounded-lg border bg-card p-4 lg:p-6">
							<h4 className="mb-2 font-semibold text-lg">{item.question}</h4>
							<p className="text-foreground/60">{item.answer}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
