import type { ChangelogItem } from "../types";

import { format, formatDistance, parseISO } from "date-fns";

export const ChangelogSection = ({
	items,
}: Readonly<{ items: ChangelogItem[] }>) => {
	return (
		<section id="changelog">
			<div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-4 text-left">
				{items?.map((item) => (
					<div
						key={`changelog-${item.date}`}
						className="rounded-xl border bg-card p-6"
					>
						<small
							className="inline-block rounded-full border border-highlight/50 px-2 py-0.5 font-semibold text-highlight text-xs"
							title={format(parseISO(item.date), "yyyy-MM-dd")}
						>
							{formatDistance(parseISO(item.date), new Date(), {
								addSuffix: true,
							})}
						</small>
						<ul className="mt-4 list-disc space-y-2 pl-6">
							{item.changes.map((change) => (
								<li key={`${item.date}-${change}`}>{change}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
};
