"use client";

import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { useTranslations } from "next-intl";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@ui/components/alert-dialog";
import { Button } from "@ui/components/button";

type ConfirmOptions = {
	title: string;
	message?: string;
	cancelLabel?: string;
	confirmLabel?: string;
	destructive?: boolean;
	onConfirm: () => Promise<void> | void;
};

type ConfirmationAlertContextValue = {
	confirm: (options: ConfirmOptions) => void;
};

const ConfirmationAlertContext = createContext<ConfirmationAlertContextValue>({
	confirm: () => {},
});

export const useConfirmationAlert = () => {
	const context = useContext(ConfirmationAlertContext);

	if (!context) {
		throw new Error(
			"useConfirmationAlert must be used within a ConfirmationAlertProvider",
		);
	}

	return context;
};

export const ConfirmationAlertProvider = ({
	children,
}: Readonly<PropsWithChildren>) => {
	const t = useTranslations();
	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const confirm = useCallback((newOptions: ConfirmOptions) => {
		setOptions(newOptions);
		setIsOpen(true);
	}, []);

	const handleConfirm = useCallback(async () => {
		if (!options) {
			return;
		}

		setIsLoading(true);

		try {
			await options.onConfirm();
		} finally {
			setIsLoading(false);
			setIsOpen(false);
			setOptions(null);
		}
	}, [options]);

	const value = useMemo(
		() => ({
			confirm,
		}),
		[confirm],
	);

	return (
		<ConfirmationAlertContext.Provider value={value}>
			{children}

			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{options?.title}</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogDescription>
						{options?.message}
					</AlertDialogDescription>

					<AlertDialogFooter>
						<AlertDialogCancel disabled={isLoading}>
							{options?.cancelLabel ?? t("common.cancel")}
						</AlertDialogCancel>
						<Button
							loading={isLoading}
							variant={options?.destructive ? "error" : "primary"}
							onClick={handleConfirm}
						>
							{options?.confirmLabel ?? t("common.confirm")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ConfirmationAlertContext.Provider>
	);
};
