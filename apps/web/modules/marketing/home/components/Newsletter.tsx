"use client";

import { useTranslations } from "next-intl";
import { CheckCircleIcon, KeyIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNewsletterSignupMutation } from "@marketing/home/lib/api";

import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";

const formSchema = z.object({
	email: z.string().email(),
});
type FormValues = z.infer<typeof formSchema>;

export const Newsletter = () => {
	const t = useTranslations();
	const newsletterSignupMutation = useNewsletterSignupMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = form.handleSubmit(async ({ email }) => {
		try {
			await newsletterSignupMutation.mutateAsync({ email });
		} catch {
			form.setError("email", {
				message: t("newsletter.hints.error.message"),
			});
		}
	});

	return (
		<section className="py-16">
			<div className="container">
				<div className="mb-8 text-center">
					<KeyIcon className="mx-auto mb-3 size-8 text-primary" />
					<h1 className="font-bold text-3xl lg:text-4xl">
						{t("newsletter.title")}
					</h1>
					<p className="mt-3 text-lg opacity-70">
						{t("newsletter.subtitle")}
					</p>
				</div>

				<div className="mx-auto max-w-lg">
					{form.formState.isSubmitSuccessful ? (
						<Alert variant="success">
							<CheckCircleIcon />
							<AlertTitle>
								{t("newsletter.hints.success.title")}
							</AlertTitle>
							<AlertDescription>
								{t("newsletter.hints.success.message")}
							</AlertDescription>
						</Alert>
					) : (
						<form onSubmit={onSubmit}>
							<div className="flex items-start">
								<Input
									required
									placeholder={t("newsletter.email")}
									type="email"
									{...form.register("email")}
								/>

								<Button
									className="ml-4"
									loading={form.formState.isSubmitting}
									type="submit"
								>
									{t("newsletter.submit")}
								</Button>
							</div>
							{form.formState.errors.email ? (
								<p className="mt-1 text-destructive text-xs">
									{form.formState.errors.email.message}
								</p>
							) : null}
						</form>
					)}
				</div>
			</div>
		</section>
	);
};
