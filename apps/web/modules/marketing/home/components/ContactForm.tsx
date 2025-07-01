"use client";

import { useTranslations } from "next-intl";
import { MailCheckIcon, MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContactFormMutation } from "@marketing/home/lib/api";

import {
	type ContactFormValues,
	contactFormSchema,
} from "@repo/api/src/routes/contact/types";
import { Alert, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { Textarea } from "@ui/components/textarea";

export const ContactForm = () => {
	const t = useTranslations();
	const contactFormMutation = useContactFormMutation();

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		try {
			await contactFormMutation.mutateAsync(values);
		} catch {
			form.setError("root", {
				message: t("contact.form.notifications.error"),
			});
		}
	});

	return (
		<div>
			{form.formState.isSubmitSuccessful ? (
				<Alert variant="success">
					<MailCheckIcon />
					<AlertTitle>{t("contact.form.notifications.success")}</AlertTitle>
				</Alert>
			) : (
				<Form {...form}>
					<form
						className="flex flex-col items-stretch gap-4"
						onSubmit={onSubmit}
					>
						{form.formState.errors.root?.message ? (
							<Alert variant="error">
								<MailIcon />
								<AlertTitle>{form.formState.errors.root.message}</AlertTitle>
							</Alert>
						) : null}

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("contact.form.name")}</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("contact.form.email")}</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("contact.form.message")}</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							className="w-full"
							loading={form.formState.isSubmitting}
							type="submit"
						>
							{t("contact.form.submit")}
						</Button>
					</form>
				</Form>
			)}
		</div>
	);
};
