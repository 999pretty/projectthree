"use client";

import { parseAsString, useQueryState } from "nuqs";

import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { Button } from "@ui/components/button";

import { oAuthProviders } from "../constants/oauth-providers";

export const SocialSigninButton = ({
	provider,
	className,
}: Readonly<{
	provider: keyof typeof oAuthProviders;
	className?: string;
}>) => {
	const [invitationId] = useQueryState("invitationId", parseAsString);
	const providerData = oAuthProviders[provider];

	const redirectPath = invitationId
		? `/app/organization-invitation/${invitationId}`
		: config.auth.redirectAfterSignIn;

	const onSignin = () => {
		const callbackURL = new URL(redirectPath, window.location.origin);
		authClient.signIn.social({
			provider,
			callbackURL: callbackURL.toString(),
		});
	};

	return (
		<Button
			className={className}
			type="button"
			variant="light"
			onClick={() => onSignin()}
		>
			{providerData.icon ? (
				<i className="mr-2 text-primary">
					<providerData.icon className="size-4" />
				</i>
			) : null}
			{providerData.name}
		</Button>
	);
};
