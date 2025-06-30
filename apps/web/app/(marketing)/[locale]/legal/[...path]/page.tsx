import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PostContent } from "@marketing/blog/components/PostContent";
import { getPostBySlug } from "@marketing/blog/utils/lib/posts";

export default async function LegalPage({
	params,
}: { params: Promise<{ path: string; locale: string }> }) {
	const { path, locale } = await params;
	setRequestLocale(locale);

	const post = await getPostBySlug(path, { locale });

	if (!post) {
		notFound();
	}

	return (
		<div className="container mx-auto max-w-3xl pt-24 pb-16">
			<h1 className="mb-8 font-bold text-4xl">{post.title}</h1>
			<PostContent content={post.body} />
		</div>
	);
}

export async function generateMetadata({
	params,
}: { params: Promise<{ path: string; locale: string }> }): Promise<Metadata> {
	const { path, locale } = await params;
	const t = await getTranslations();
	const post = await getPostBySlug(path, { locale });

	if (!post) {
		notFound();
	}

	return {
		title: `${post.title} | ${t("legal.title")}`,
		description: post.excerpt,
	};
}
