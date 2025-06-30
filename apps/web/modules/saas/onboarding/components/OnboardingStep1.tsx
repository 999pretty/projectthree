"use client";

import type { SubmitHandler } from "react-hook-form";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@repo/auth/client";
import { useSession } from "@saas/auth/hooks/use-session";
import { UserAvatarUpload } from "@saas/settings/components/UserAvatarUpload";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@ui/components/form";
import { Input } from "@ui/components/input";

const formSchema = z.object({
	name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const OnboardingStep1 = ({
	onCompleted,
}: Readonly<{ onCompleted: () => void }>) => {
	const t = useTranslations();
	const { user } = useSession();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name ?? "",
		},
	});

	useEffect(() => {
		if (user) {
			form.setValue("name", user.name ?? "");
		}
	}, [user, form]);

	const onSubmit: SubmitHandler<FormValues> = async ({ name }) => {
		form.clearErrors("root");

		try {
			await authClient.updateUser({
				name,
			});

			onCompleted();
		} catch (e) {
			if (process.env.NODE_ENV === "development") {
				console.error("Failed to update user during onboarding:", e);
			}
			form.setError("root", {
				type: "server",
				message: t("onboarding.notifications.accountSetupFailed"),
			});
		}
	};

	return (
		<div>
			<Form {...form}>
				<form
					className="flex flex-col items-stretch gap-8"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("onboarding.account.name")}
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormItem className="flex items-center justify-between gap-4">
						<div>
							<FormLabel>
								{t("onboarding.account.avatar")}
							</FormLabel>

							<FormDescription>
								{t("onboarding.account.avatarDescription")}
							</FormDescription>
						</div>
						<FormControl>
							<UserAvatarUpload
								onError={() => {
									return;
								}}
								onSuccess={() => {
									return;
								}}
							/>
						</FormControl>
					</FormItem>

					<Button loading={form.formState.isSubmitting} type="submit">
						{t("onboarding.continue")}
						<ArrowRightIcon className="ml-2 size-4" />
					</Button>
				</form>
			</Form>
		</div>
	);
};
