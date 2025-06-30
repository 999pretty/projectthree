"use client";
import { StatsTile } from "@saas/start/components/StatsTile";
import { Card } from "@ui/components/card";

export const OrganizationStart = () => {
	return (
		<div className="@container">
			<div className="grid @2xl:grid-cols-3 gap-4">
				<StatsTile
					title="New clients"
					trend={0.12}
					value={344}
					valueFormat="number"
				/>
				<StatsTile
					title="Revenue"
					trend={0.6}
					value={5243}
					valueFormat="currency"
				/>
				<StatsTile
					title="Churn"
					trend={-0.3}
					value={0.03}
					valueFormat="percentage"
				/>
			</div>

			<Card className="mt-6">
				<div className="flex h-64 items-center justify-center p-8 text-foreground/60">
					Place your content here...
				</div>
			</Card>
		</div>
	);
};
