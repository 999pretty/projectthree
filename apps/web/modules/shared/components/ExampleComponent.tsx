"use client";

import { useExample } from "@shared/lib/example-api";

export const ExampleComponent = ({ id }: Readonly<{ id: string }>) => {
	const { data, isLoading, error } = useExample(id);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	if (!data) {
		return null;
	}

	return (
		<div>
			<h1>{data.name}</h1>
			<p>ID: {data.id}</p>
			<p>Created: {data.createdAt}</p>
		</div>
	);
};
