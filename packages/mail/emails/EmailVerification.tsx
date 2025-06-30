import type { BaseMailProps } from "../types";

import { createTranslator } from "use-intl/core";
import { Link, Text } from "@react-email/components";

import { PrimaryButton } from "../src/components/PrimaryButton";
import { Wrapper } from "../src/components/Wrapper";
import { defaultLocale, defaultTranslations } from "../src/util/translations";

export const EmailVerification = ({
	url,
	locale,
	translations,
}: {
	url: string;
} & BaseMailProps) => {
	const t = createTranslator({
		locale,
		messages: translations,
	});

	return (
		<Wrapper>
			<Text>{t("mail.emailVerification.body")}</Text>

			<PrimaryButton href={url}>
				{t("mail.emailVerification.verify")} &rarr;
			</PrimaryButton>

			<Text className="text-muted-foreground text-sm">
				{t("mail.common.openLinkInBrowser")}
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
};

EmailVerification.PreviewProps = {
	locale: defaultLocale,
	translations: defaultTranslations,
	url: "#",
};
