import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { withQuery } from "ufo";
import { routing } from "@i18n/routing";

import { config as appConfig } from "@repo/config";
import { createPurchasesHelper } from "@repo/payments/lib/helper";
import {
	getOrganizationsForSession,
	getPurchasesForSession,
	getSession,
} from "@shared/lib/middleware-helpers";

const intlMiddleware = createMiddleware(routing);

async function handleOnboardingRedirect(
	pathname: string,
	origin: string,
	session: any,
) {
	if (
		appConfig.users.enableOnboarding &&
		!session.user.onboardingComplete &&
		pathname !== "/app/onboarding"
	) {
		return NextResponse.redirect(
			new URL(
				withQuery("/app/onboarding", {
					redirectTo: pathname,
				}),
				origin,
			),
		);
	}
	return null;
}

async function handleOrganizationRedirect(
	req: NextRequest,
	origin: string,
	session: any,
) {
	if (
		appConfig.organizations.enable &&
		appConfig.organizations.requireOrganization &&
		req.nextUrl.pathname === "/app"
	) {
		const organizations = await getOrganizationsForSession(req);
		const organization =
			organizations.find(
				(org) => org.id === session?.session.activeOrganizationId,
			) ?? organizations[0];

		return NextResponse.redirect(
			new URL(
				organization ? `/app/${organization.slug}` : "/app/new-organization",
				origin,
			),
		);
	}
	return null;
}

async function handleBillingRedirect(
	req: NextRequest,
	pathname: string,
	origin: string,
	session: any,
) {
	const hasFreePlan = Object.values(appConfig.payments.plans).some(
		(plan) => "isFree" in plan,
	);

	if (
		((appConfig.organizations.enable &&
			appConfig.organizations.enableBilling) ||
			appConfig.users.enableBilling) &&
		!hasFreePlan
	) {
		const organizationId = appConfig.organizations.enable
			? (session?.session.activeOrganizationId ??
				(await getOrganizationsForSession(req))?.at(0)?.id)
			: undefined;

		const purchases = await getPurchasesForSession(req, organizationId);
		const { activePlan } = createPurchasesHelper(purchases);

		const validPathsWithoutPlan = [
			"/app/choose-plan",
			"/app/onboarding",
			"/app/new-organization",
			"/app/organization-invitation/",
		];
		if (
			!activePlan &&
			!validPathsWithoutPlan.some((path) => pathname.startsWith(path))
		) {
			return NextResponse.redirect(new URL("/app/choose-plan", origin));
		}
	}
	return null;
}

async function handleAppRoutes(
	req: NextRequest,
	pathname: string,
	origin: string,
) {
	if (!appConfig.ui.saas.enabled) {
		return NextResponse.redirect(new URL("/", origin));
	}

	const session = await getSession(req);
	let locale = req.cookies.get(appConfig.i18n.localeCookieName)?.value;

	if (!session) {
		return NextResponse.redirect(
			new URL(
				withQuery("/auth/login", {
					redirectTo: pathname,
				}),
				origin,
			),
		);
	}

	const onboardingRedirect = await handleOnboardingRedirect(
		pathname,
		origin,
		session,
	);
	if (onboardingRedirect) {
		return onboardingRedirect;
	}

	if (!locale || (session.user.locale && locale !== session.user.locale)) {
		locale = session.user.locale ?? appConfig.i18n.defaultLocale;
		req.cookies.set(appConfig.i18n.localeCookieName, locale);
	}

	const organizationRedirect = await handleOrganizationRedirect(
		req,
		origin,
		session,
	);
	if (organizationRedirect) {
		return organizationRedirect;
	}

	const billingRedirect = await handleBillingRedirect(
		req,
		pathname,
		origin,
		session,
	);
	if (billingRedirect) {
		return billingRedirect;
	}

	return NextResponse.next();
}

async function handleAuthRoutes(req: NextRequest, origin: string) {
	if (!appConfig.ui.saas.enabled) {
		return NextResponse.redirect(new URL("/", origin));
	}

	const session = await getSession(req);

	if (session && req.nextUrl.pathname !== "/auth/reset-password") {
		return NextResponse.redirect(new URL("/app", origin));
	}

	return NextResponse.next();
}

export default async function middleware(req: NextRequest) {
	const { pathname, origin } = req.nextUrl;

	if (pathname.startsWith("/app")) {
		return handleAppRoutes(req, pathname, origin);
	}

	if (pathname.startsWith("/auth")) {
		return handleAuthRoutes(req, origin);
	}

	if (!appConfig.ui.marketing.enabled) {
		return NextResponse.redirect(new URL("/app", origin));
	}

	return intlMiddleware(req);
}

export const config = {
	matcher: [
		"/((?!api|image-proxy|images|fonts|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|monitoring-tunnel).*)",
	],
};
