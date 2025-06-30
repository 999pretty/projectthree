import type { PropsWithChildren } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getTranslations } from "next-intl/server";

import { docsSource } from "../../../../docs-source";

//  : Next.js requires default exports for layout files
export default async function DocumentationLayout({
	children,
	params,
}: PropsWithChildren<{
	params: Promise<{ locale: string }>;
}>) {
	const t = await getTranslations();
	const { locale } = await params;

	return (
		<div className="pt-[4.5rem]">
			<DocsLayout
				disableThemeSwitch
				i18n
				nav={{
					title: <strong>{t("documentation.title")}</strong>,
					url: "/docs",
				}}
				sidebar={{
					defaultOpenLevel: 1,
				}}
				tree={docsSource.pageTree[locale]}
			>
				{children}
			</DocsLayout>
		</div>
	);
}
