"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
	ArrowRightIcon,
	BadgePercentIcon,
	CheckIcon,
	PhoneIcon,
	StarIcon,
} from "lucide-react";
import { LocaleLink } from "@i18n/routing";

import { type Config, config } from "@repo/config";
import { usePlanData } from "@saas/payments/hooks/plan-data";
import { useCreateCheckoutLinkMutation } from "@saas/payments/lib/api";
import type { PlanId } from "@saas/payments/types";
import { Button } from "@ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";
import { cn } from "@ui/lib";
import { useLocaleCurrency } from "@shared/hooks/locale-currency";
import { useRouter } from "@shared/hooks/router";

const plans = config.payments.plans as Config["payments"]["plans"];

const getPlanPrice = (
	plan: Config["payments"]["plans"][keyof Config["payments"]["plans"]],
	interval: "month" | "year",
	localeCurrency: string,
) => {
	const { isFree, prices } = plan;

	if (isFree) {
		return {
			amount: 0,
			currency: localeCurrency,
			interval,
			productId: "",
			type: "recurring" as const,
		};
	}

	return prices?.find(
		(price) =>
			!price.hidden &&
			(price.type === "one-time" || price.interval === interval) &&
			price.currency === localeCurrency,
	);
};

const PlanActionButton = ({
	isEnterprise,
	loading,
	planId,
	recommended,
	onSelectPlan,
	price,
	userId,
	organizationId,
}: {
	isEnterprise?: boolean;
	loading: PlanId | false;
	planId: string;
	recommended?: boolean;
	onSelectPlan: (planId: PlanId, productId?: string) => Promise<void>;
	price: ReturnType<typeof getPlanPrice>;
	userId?: string;
	organizationId?: string;
}) => {
	const t = useTranslations();

	if (isEnterprise) {
		return (
			<Button asChild className="mt-4 w-full" variant="light">
				<LocaleLink href="/contact">
					<PhoneIcon className="mr-2 size-4" />
					{t("pricing.contactSales")}
				</LocaleLink>
			</Button>
		);
	}

	return (
		<Button
			className="mt-4 w-full"
			loading={loading === planId}
			variant={recommended ? "primary" : "secondary"}
			onClick={() => onSelectPlan(planId as PlanId, price?.productId)}
		>
			{userId || organizationId
				? t("pricing.choosePlan")
				: t("pricing.getStarted")}
			<ArrowRightIcon className="ml-2 size-4" />
		</Button>
	);
};

const PricingPlan = ({
	planId,
	plan,
	loading,
	interval,
	localeCurrency,
	organizationId,
	userId,
	onSelectPlan,
}: Readonly<{
	planId: string;
	plan: Config["payments"]["plans"][keyof Config["payments"]["plans"]];
	loading: PlanId | false;
	interval: "month" | "year";
	localeCurrency: string;
	organizationId?: string;
	userId?: string;
	onSelectPlan: (planId: PlanId, productId?: string) => Promise<void>;
}>) => {
	const t = useTranslations();
	const { planData } = usePlanData();
	const { isEnterprise, recommended } = plan;
	const { title, description, features } =
		planData[planId as keyof typeof planData];

	const price = getPlanPrice(plan, interval, localeCurrency);

	if (!price && !isEnterprise) {
		return null;
	}

	return (
		<div
			className={cn("rounded-3xl border p-6", {
				"border-2 border-primary": recommended,
			})}
			data-test="price-table-plan"
		>
			<div className="flex h-full flex-col justify-between gap-4">
				<div>
					{recommended ? (
						<div className="-mt-9 flex justify-center">
							<div className="mb-2 flex h-6 w-auto items-center gap-1.5 rounded-full bg-primary px-2 py-1 font-semibold text-primary-foreground text-xs">
								<StarIcon className="size-3" />
								{t("pricing.recommended")}
							</div>
						</div>
					) : null}
					<h3
						className={cn("my-0 font-semibold text-2xl", {
							"font-bold text-primary": recommended,
						})}
					>
						{title}
					</h3>
					{description ? (
						<div className="prose mt-2 text-foreground/60 text-sm">
							{description}
						</div>
					) : null}

					{!!features?.length && (
						<ul className="mt-4 grid list-none gap-2 text-sm">
							{features.map((feature) => (
								<li
									key={String(feature)}
									className="flex items-center justify-start"
								>
									<CheckIcon className="mr-2 size-4 text-primary" />
									<span>{feature}</span>
								</li>
							))}
						</ul>
					)}

					{price && "trialPeriodDays" in price && price.trialPeriodDays ? (
						<div className="mt-4 flex items-center justify-start font-medium text-primary text-sm opacity-80">
							<BadgePercentIcon className="mr-2 size-4" />
							{t("pricing.trialPeriod", {
								days: price.trialPeriodDays,
							})}
						</div>
					) : null}
				</div>

				<div>
					{price ? (
						<strong
							className="block font-medium text-2xl lg:text-3xl"
							data-test="price-table-plan-price"
						>
							{Intl.NumberFormat("en-US", {
								style: "currency",
								currency: price.currency,
								minimumFractionDigits: 0,
							}).format(price.amount)}
							{"interval" in price && (
								<span className="font-normal text-xs opacity-60">
									{" / "}
									{interval === "month"
										? t("pricing.month", {
												count: price.intervalCount ?? 1,
											})
										: t("pricing.year", {
												count: price.intervalCount ?? 1,
											})}
								</span>
							)}
							{organizationId && "seatBased" in price && price.seatBased ? (
								<span className="font-normal text-xs opacity-60">
									{" / "}
									{t("pricing.perSeat")}
								</span>
							) : null}
						</strong>
					) : null}

					<PlanActionButton
						isEnterprise={isEnterprise}
						loading={loading}
						organizationId={organizationId}
						planId={planId}
						price={price}
						recommended={recommended}
						userId={userId}
						onSelectPlan={onSelectPlan}
					/>
				</div>
			</div>
		</div>
	);
};

export const PricingTable = ({
	className,
	userId,
	organizationId,
	activePlanId,
}: Readonly<{
	className?: string;
	userId?: string;
	organizationId?: string;
	activePlanId?: string;
}>) => {
	const t = useTranslations();
	const router = useRouter();
	const localeCurrency = useLocaleCurrency();
	const [loading, setLoading] = useState<PlanId | false>(false);
	const [interval, setInterval] = useState<"month" | "year">("month");

	const createCheckoutLinkMutation = useCreateCheckoutLinkMutation();

	const onSelectPlan = async (planId: PlanId, productId?: string) => {
		if (!(userId || organizationId)) {
			router.push("/auth/signup");
		}

		const plan = plans[planId];
		const price = plan.prices?.find((price) => price.productId === productId);

		if (!price) {
			return;
		}

		setLoading(planId);

		try {
			const { checkoutLink } = await createCheckoutLinkMutation.mutateAsync({
				type: price.type === "one-time" ? "one-time" : "subscription",
				productId: price.productId,
				organizationId,
				redirectUrl: window.location.href,
			});

			window.location.href = checkoutLink;
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const filteredPlans = Object.entries(plans).filter(
		([planId]) =>
			planId !== activePlanId && (!activePlanId || planId !== "free"),
	);

	const hasSubscriptions = filteredPlans.some(([_, plan]) =>
		plan.prices?.some((price) => price.type === "recurring"),
	);

	return (
		<div className={cn("@container", className)}>
			{hasSubscriptions ? (
				<div className="mb-6 flex @xl:justify-center">
					<Tabs
						data-test="price-table-interval-tabs"
						value={interval}
						onValueChange={(value) => setInterval(value as typeof interval)}
					>
						<TabsList className="border-foreground/10">
							<TabsTrigger value="month">{t("pricing.monthly")}</TabsTrigger>
							<TabsTrigger value="year">{t("pricing.yearly")}</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			) : null}
			<div
				className={cn("grid grid-cols-1 gap-4", {
					"@xl:grid-cols-2": filteredPlans.length >= 2,
					"@3xl:grid-cols-3": filteredPlans.length >= 3,
					"@4xl:grid-cols-4": filteredPlans.length >= 4,
				})}
			>
				{filteredPlans
					.filter(([planId]) => planId !== activePlanId)
					.map(([planId, plan]) => (
						<PricingPlan
							key={planId}
							interval={interval}
							loading={loading}
							localeCurrency={localeCurrency}
							organizationId={organizationId}
							plan={plan}
							planId={planId}
							userId={userId}
							onSelectPlan={onSelectPlan}
						/>
					))}
			</div>
		</div>
	);
};
