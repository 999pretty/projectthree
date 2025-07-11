import type { InferRequestType } from "hono";

import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@shared/lib/api-client";

export const signedUploadUrlMutationKey = ["signed-upload-url"];
export const useSignedUploadUrlMutation = () => {
	return useMutation({
		mutationKey: signedUploadUrlMutationKey,
		mutationFn: async (
			query: InferRequestType<
				(typeof apiClient.uploads)["signed-upload-url"]["$post"]
			>["query"],
		) => {
			const response = await apiClient.uploads["signed-upload-url"].$post({
				query,
			});

			if (!response.ok) {
				throw new Error("Failed to get signed upload url");
			}

			return response.json();
		},
	});
};
