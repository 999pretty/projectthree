import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";

// Define response schema
const ExampleResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.string(),
});

export const exampleRouter = new Hono().basePath("/examples").get(
	"/:id",
	describeRoute({
		tags: ["Examples"],
		summary: "Get example by ID",
		description: "Returns an example object by its ID",
		responses: {
			200: {
				description: "Example found",
				content: {
					"application/json": {
						schema: resolver(ExampleResponseSchema),
					},
				},
			},
			404: {
				description: "Example not found",
			},
		},
	}),
	async (c) => {
		const id = c.req.param("id");

		// Example response
		const example = {
			id,
			name: "Example Item",
			createdAt: new Date().toISOString(),
		};

		return c.json(example);
	},
);
