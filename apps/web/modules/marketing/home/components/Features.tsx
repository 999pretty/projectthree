"use client";

import { type JSXElementConstructor, type ReactNode, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import {
	CloudIcon,
	ComputerIcon,
	PaperclipIcon,
	StarIcon,
	WandIcon,
} from "lucide-react";
import { MobileIcon } from "@radix-ui/react-icons";

import { cn } from "@ui/lib";

import heroImage from "../../../../public/images/hero.svg";

export const featureTabs: Array<{
	id: string;
	title: string;
	icon: JSXElementConstructor<any>;
	subtitle?: string;
	description?: ReactNode;
	image?: StaticImageData;
	imageBorder?: boolean;
	stack?: {
		id: string;
		title: string;
		href: string;
		icon: JSXElementConstructor<any>;
	}[];
	highlights?: {
		id: string;
		title: string;
		description: string;
		icon: JSXElementConstructor<any>;
		demoLink?: string;
		docsLink?: string;
	}[];
}> = [
	{
		id: "feature1",
		title: "Feature 1",
		icon: StarIcon,
		subtitle: "Do more with our amazing SaaS.",
		description:
			"This is a brilliant feature. And below you can see some reasons why. This is basically just a dummy text.",
		stack: [],
		image: heroImage,
		imageBorder: false,
		highlights: [
			{
				id: "feature1-benefit1",
				title: "Benefit 1",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: WandIcon,
			},
			{
				id: "feature1-benefit2",
				title: "Benefit 2",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: ComputerIcon,
			},
			{
				id: "feature1-benefit3",
				title: "Benefit 3",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: MobileIcon,
			},
		],
	},
	{
		id: "feature2",
		title: "Feature 2",
		icon: CloudIcon,
		subtitle: "Your SaaS can also do this.",
		description: "Another dummy text for another feature.",
		stack: [],
		image: heroImage,
		imageBorder: false,
		highlights: [
			{
				id: "feature2-benefit1",
				title: "Benefit 1",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: WandIcon,
			},
			{
				id: "feature2-benefit2",
				title: "Benefit 2",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: ComputerIcon,
			},
			{
				id: "feature2-benefit3",
				title: "Benefit 3",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: MobileIcon,
			},
		],
	},
	{
		id: "feature3",
		title: "Feature 3",
		icon: PaperclipIcon,
		subtitle: "We even got a third one.",
		description:
			"Of course your SaaS will have more features than this, but this is just a dummy text.",
		stack: [],
		image: heroImage,
		imageBorder: false,
		highlights: [
			{
				id: "feature3-benefit1",
				title: "Benefit 1",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: WandIcon,
			},
			{
				id: "feature3-benefit2",
				title: "Benefit 2",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: ComputerIcon,
			},
			{
				id: "feature3-benefit3",
				title: "Benefit 3",
				description:
					"This is an awesome benefit. And below you can see some reasons why. This is basically just a dummy text.",
				icon: MobileIcon,
			},
		],
	},
];

export const Features = () => {
	const [selectedTab, setSelectedTab] = useState(featureTabs[0].id);
	return (
		<section className="scroll-my-20 pt-12 lg:pt-16" id="features">
			<div className="container max-w-5xl">
				<div className="mx-auto mb-6 lg:mb-0 lg:max-w-5xl lg:text-center">
					<h2 className="font-bold text-4xl lg:text-5xl">
						Features your clients will love
					</h2>
					<p className="mt-6 text-balance text-lg opacity-50">
						In this section you can showcase all the features of your SaaS
						provides and how they can benefit your clients.
					</p>
				</div>

				<div className="mt-8 mb-4 hidden justify-center lg:flex">
					{featureTabs.map((tab) => {
						return (
							<button
								key={tab.id}
								className={cn(
									"flex w-24 cursor-pointer flex-col items-center gap-2 rounded-lg px-4 py-2 md:w-32",
									selectedTab === tab.id
										? "bg-primary/5 font-bold text-primary dark:bg-primary/10"
										: "font-medium text-foreground/80",
								)}
								type="button"
								onClick={() => setSelectedTab(tab.id)}
							>
								<tab.icon
									className={cn(
										"size-6 md:size-8",
										selectedTab === tab.id
											? "text-primary"
											: "text-foreground opacity-30",
									)}
								/>
								<span className="text-xs md:text-sm">{tab.title}</span>
							</button>
						);
					})}
				</div>
			</div>

			<div>
				<div className="container max-w-5xl">
					{featureTabs.map((tab) => {
						const filteredStack = tab.stack || [];
						const filteredHighlights = tab.highlights || [];
						return (
							<div
								key={tab.id}
								className={cn(
									"border-t py-8 first:border-t-0 md:py-12 lg:rounded-3xl lg:border lg:p-6 lg:first:border-t",
									selectedTab === tab.id ? "block" : "block lg:hidden",
								)}
							>
								<div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">
									<div>
										<h3 className="font-normal text-2xl text-foreground/60 leading-normal md:text-3xl">
											<strong className="text-secondary">{tab.title}. </strong>
											{tab.subtitle}
										</h3>

										{tab.description ? (
											<p className="mt-4 text-foreground/60">
												{tab.description}
											</p>
										) : null}

										{filteredStack?.length > 0 && (
											<div className="mt-4 flex flex-wrap gap-6">
												{filteredStack.map((tool) => (
													<a
														key={tool.id}
														className="flex items-center gap-2"
														href={tool.href}
														rel="noreferrer"
														target="_blank"
													>
														<tool.icon className="size-6" />
														<strong className="block text-sm">
															{tool.title}
														</strong>
													</a>
												))}
											</div>
										)}
									</div>
									<div>
										{tab.image ? (
											<Image
												alt={tab.title}
												className={cn(" h-auto w-full max-w-xl", {
													"rounded-2xl border-4 border-secondary/10":
														tab.imageBorder,
												})}
												src={tab.image}
											/>
										) : null}
									</div>
								</div>

								{filteredHighlights.length > 0 && (
									<div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
										{filteredHighlights.map((highlight) => (
											<div
												key={highlight.id}
												className="flex flex-col items-stretch justify-between rounded-xl border bg-card p-4"
											>
												<div>
													<highlight.icon
														className="text-primary text-xl"
														height="1em"
														width="1em"
													/>
													<strong className="mt-2 block">
														{highlight.title}
													</strong>
													<p className="mt-1 text-sm opacity-50">
														{highlight.description}
													</p>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};
