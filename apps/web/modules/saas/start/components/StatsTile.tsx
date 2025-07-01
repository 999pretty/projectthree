"use client";

import { useMemo } from "react";
import { useFormatter } from "next-intl";

import { Badge } from "@ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { useLocaleCurrency } from "@shared/hooks/locale-currency";

type Props = {
	title: string;
	value: number;
	valueFormat: "currency" | "number" | "percentage";
	context?: string;
	icon?: React.ReactNode;
	trend?: number;
};

export const StatsTile = ({
	title,
	value,
	context,
	trend,
	valueFormat,
}: Readonly<Props>) => {
	const format = useFormatter();
	const localeCurrency = useLocaleCurrency();

	const formattedValue = useMemo(() => {
		// format currency
		if (valueFormat === "currency") {
			return format.number(value, {
				style: "currency",
				currency: localeCurrency,
			});
		}
		// format percentage
		if (valueFormat === "percentage") {
			return format.number(value, {
				style: "percent",
			});
		}
		// format default number
		return format.number(value);
	}, [value, valueFormat, format, localeCurrency]);

	const formattedTrend = useMemo(() => {
		if (!trend) {
			return null;
		}
		return `${trend >= 0 ? "+" : ""}${format.number(trend, {
			style: "percent",
		})}`;
	}, [trend, format]);

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-foreground/60 text-sm">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<strong className="font-bold text-2xl">
						{formattedValue}
						{context ? <small>{context}</small> : null}
					</strong>
					{trend ? (
						<Badge status={trend > 0 ? "success" : "error"}>
							{formattedTrend}
						</Badge>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
};
