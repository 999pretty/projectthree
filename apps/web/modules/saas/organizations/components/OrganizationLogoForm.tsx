"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { organizationListQueryKey } from "@saas/organizations/lib/api";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { useSignedUploadUrlMutation } from "@saas/shared/lib/api";
import { Spinner } from "@shared/components/Spinner";

import { CropImageDialog } from "../../settings/components/CropImageDialog";

import { OrganizationLogo } from "./OrganizationLogo";

export const OrganizationLogoForm = () => {
	const t = useTranslations();
	const [uploading, setUploading] = useState(false);
	const [cropDialogOpen, setCropDialogOpen] = useState(false);
	const [image, setImage] = useState<File | null>(null);
	const { activeOrganization, refetchActiveOrganization } =
		useActiveOrganization();
	const queryClient = useQueryClient();
	const getSignedUploadUrlMutation = useSignedUploadUrlMutation();

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			setImage(acceptedFiles[0]);
			setCropDialogOpen(true);
		},
		accept: {
			"image/png": [".png"],
			"image/jpeg": [".jpg", ".jpeg"],
		},
		multiple: false,
	});

	if (!activeOrganization) {
		return null;
	}

	const onCrop = async (croppedImageData: Blob | null) => {
		if (!croppedImageData) {
			return;
		}

		setUploading(true);
		try {
			const path = `${activeOrganization.id}-${uuid()}.png`;
			const { signedUrl } = await getSignedUploadUrlMutation.mutateAsync({
				path,
				bucket: config.storage.bucketNames.avatars,
			});

			const response = await fetch(signedUrl, {
				method: "PUT",
				body: croppedImageData,
				headers: {
					"Content-Type": "image/png",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to upload image");
			}

			const { error } = await authClient.organization.update({
				organizationId: activeOrganization.id,
				data: {
					logo: path,
				},
			});

			if (error) {
				throw error;
			}

			toast.success(t("settings.account.avatar.notifications.success"));

			refetchActiveOrganization();
			queryClient.invalidateQueries({
				queryKey: organizationListQueryKey,
			});
		} catch (e) {
			if (process.env.NODE_ENV === "development") {
				console.error("Failed to upload organization logo:", e);
			}
			toast.error(t("settings.account.avatar.notifications.error"));
		} finally {
			setUploading(false);
		}
	};

	return (
		<SettingsItem
			description={t("organizations.settings.logo.description")}
			title={t("organizations.settings.logo.title")}
		>
			<div className="relative size-24 rounded-full" {...getRootProps()}>
				<input {...getInputProps()} />
				<OrganizationLogo
					className="size-24 cursor-pointer text-xl"
					logoUrl={activeOrganization.logo}
					name={activeOrganization.name ?? ""}
				/>

				{uploading ? (
					<div className="absolute inset-0 z-20 flex items-center justify-center bg-card/90">
						<Spinner />
					</div>
				) : null}
			</div>

			<CropImageDialog
				image={image}
				open={cropDialogOpen}
				onCrop={onCrop}
				onOpenChange={setCropDialogOpen}
			/>
		</SettingsItem>
	);
};
