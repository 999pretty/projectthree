import type { PropsWithChildren } from "react";

export const SettingsList = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<div className="@container flex flex-col gap-4">
			{Array.isArray(children)
				? children.filter(Boolean).map((child, i) => {
						const childKey =
							child?.key ?? `settings-item-${i}-${typeof child}`;
						return <div key={childKey}>{child}</div>;
					})
				: children}
		</div>
	);
};
