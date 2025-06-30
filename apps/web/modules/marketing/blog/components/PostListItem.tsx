"use client";

import Image from "next/image";
import { LocaleLink } from "@i18n/routing";
import type { Post } from "@marketing/blog/types";

export const PostListItem = ({ post }: Readonly<{ post: Post }>) => {
	const { title, excerpt, authorName, image, date, path, authorImage, tags } =
		post;

	return (
		<div className="rounded-2xl border bg-card/50 p-6">
			{image ? (
				<div className="-mx-4 -mt-4 relative mb-4 aspect-16/9 overflow-hidden rounded-xl">
					<Image
						fill
						alt={title}
						className="object-cover object-center"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						src={image}
					/>
					<LocaleLink className="absolute inset-0" href={`/blog/${path}`} />
				</div>
			) : null}

			{tags ? (
				<div className="mb-2 flex flex-wrap gap-2">
					{tags.map((tag: string) => (
						<span
							key={tag}
							className="font-semibold text-primary text-xs uppercase tracking-wider"
						>
							#{tag}
						</span>
					))}
				</div>
			) : null}

			<LocaleLink className="font-semibold text-xl" href={`/blog/${path}`}>
				{title}
			</LocaleLink>
			{excerpt ? <p className="opacity-50">{excerpt}</p> : null}

			<div className="mt-4 flex items-center justify-between">
				{authorName ? (
					<div className="flex items-center">
						{authorImage ? (
							<div className="relative mr-2 size-8 overflow-hidden rounded-full">
								<Image
									fill
									alt={authorName}
									className="object-cover object-center"
									sizes="96px"
									src={authorImage}
								/>
							</div>
						) : null}
						<div>
							<p className="font-semibold text-sm opacity-50">{authorName}</p>
						</div>
					</div>
				) : null}

				<div className="mr-0 ml-auto">
					<p className="text-sm opacity-30">
						{(() => {
							try {
								return Intl.DateTimeFormat("en-US").format(new Date(date));
							} catch (error) {
								console.error("Failed to format date:", error);
								return "Invalid Date";
							}
						})()}
					</p>
				</div>
			</div>
		</div>
	);
};
