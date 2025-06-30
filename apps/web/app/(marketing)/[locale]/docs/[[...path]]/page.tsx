import { notFound } from "next/navigation";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsBody, DocsPage as FumadocsPage } from "fumadocs-ui/page";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXContent } from "@content-collections/mdx/react";

import { config } from "@repo/config";

import { docsSource } from "../../../../docs-source";

const ZoomImage = (props: any) => (
	<ImageZoom {...props} className="rounded-lg border-4 border-secondary/10" />
);

export default async function DocsPage({
	params,
}: { params: Promise<{ path?: string[]; locale: string }> }) {
	const { path, locale } = await params;
	setRequestLocale(locale);
	const page = docsSource.getPage(path, locale);

	if (!page) {
		notFound();
	}

	return (
		<FumadocsPage
			breadcrumb={{
				enabled: true,
				includePage: true,
				includeSeparator: true,
			}}
			full={page.data.full}
			tableOfContent={{
				enabled: true,
			}}
			toc={page.data.toc}
		>
			<DocsBody>
				<h1 className="text-foreground">{page.data.title}</h1>
				{page.data.description ? (
					<p className="-mt-6 text-foreground/50 text-lg lg:text-xl">
						{page.data.description}
					</p>
				) : null}
				<div className="prose dark:prose-invert max-w-full prose-a:text-foreground prose-p:text-foreground/80">
					<MDXContent
						code={page.data.body}
						// @ts-expect-error
						components={{
							...defaultMdxComponents,
							Tabs,
							Tab,
							Steps,
							Step,
							File,
							Folder,
							Files,
							img: ZoomImage,
						}}
					/>
				</div>
			</DocsBody>
		</FumadocsPage>
	);
}

export async function generateStaticParams() {
	return docsSource.getPages().flatMap((page) => ({
		path: page.slugs,
		locale: page.locale ?? config.i18n.defaultLocale,
	}));
}

export async function generateMetadata(props: {
	params: Promise<{ path?: string[]; locale: string }>;
}) {
	const t = await getTranslations();
	const params = await props.params;
	const page = docsSource.getPage(params.path, params.locale);

	if (!page) {
		notFound();
	}

	return {
		title: `${page.data.title} | ${t("documentation.title")}`,
		description: page.data.description,
	};
}
