import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@shared/lib/api-client";

type ExampleResponse = {
	id: string;
	name: string;
	createdAt: string;
};

export const exampleQueryKey = (id: string) => ["example", id] as const;

export function useExample(id: string) {
	return useQuery({
		queryKey: exampleQueryKey(id),
		queryFn: async () => {
			const response = await apiClient.examples[":id"].$get({
				param: { id },
			});
			return response.json() as Promise<ExampleResponse>;
		},
	});
}
