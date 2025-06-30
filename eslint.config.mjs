import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: [
			"**/node_modules/**",
			"**/.next/**",
			"**/dist/**",
			"**/build/**",
			"**/*_flyout*",
		],
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: true,
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			"@typescript-eslint": typescriptPlugin,
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
			import: importPlugin,
			"jsx-a11y": jsxA11yPlugin,
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"import/order": [
				"error",
				{
					groups: [
						"type",
						"builtin",
						"external",
						"internal",
						"parent",
						"sibling",
						"index",
						"object",
					],
					"newlines-between": "always",
					distinctGroup: false,
					pathGroupsExcludedImportTypes: [],
					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
					pathGroups: [
						// Type imports should go first
						{
							pattern: "type",
							group: "type",
							position: "before",
						},
						// React and Next.js imports
						{
							pattern: "react",
							group: "external",
							position: "before",
						},
						{
							pattern: "next/*",
							group: "external",
							position: "before",
						},
						{
							pattern: "next-*",
							group: "external",
							position: "before",
						},
						// Server-only should come after React/Next imports
						{
							pattern: "server-only",
							group: "external",
							position: "after",
						},
						// All external packages (anything not starting with @repo, @saas, @ui, @shared)
						{
							pattern: "@!(repo|saas|ui|shared)/**",
							group: "external",
							position: "after",
						},
						// Internal packages should come after all external packages
						{
							pattern: "@repo/**",
							group: "internal",
							position: "after",
						},
						{
							pattern: "@saas/**",
							group: "internal",
							position: "after",
						},
						{
							pattern: "@ui/**",
							group: "internal",
							position: "after",
						},
						{
							pattern: "@shared/**",
							group: "internal",
							position: "after",
						},
						// Style imports should go last
						{
							pattern: "*.css",
							group: "index",
							position: "after",
						},
						{
							pattern: "**/*.css",
							group: "index",
							position: "after",
						},
					],
				},
			],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "inline-type-imports",
				},
			],
			"react/function-component-definition": [
				"error",
				{
					namedComponents: ["function-declaration", "arrow-function"],
					unnamedComponents: ["function-expression", "arrow-function"],
				},
			],
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"react/jsx-sort-props": [
				"error",
				{
					callbacksLast: true,
					shorthandFirst: true,
					ignoreCase: true,
					reservedFirst: true,
				},
			],
			"react/jsx-tag-spacing": [
				"error",
				{
					closingSlash: "never",
					beforeSelfClosing: "always",
					afterOpening: "never",
					beforeClosing: "never",
				},
			],
			"jsx-quotes": ["error", "prefer-double"],
			"react/jsx-pascal-case": "error",
			"react/destructuring-assignment": ["error", "always"],
			"react/jsx-boolean-value": ["error", "never"],
			"react/jsx-no-useless-fragment": "error",
			"react/jsx-key": "error",
			"react/no-array-index-key": "error",
			"react/no-unescaped-entities": "error",
			"react/self-closing-comp": "error",
			"react/no-danger": "error",
			"react/no-typos": "error",
			"react/jsx-curly-brace-presence": [
				"error",
				{
					props: "never",
					children: "never",
				},
			],
			"react/jsx-no-leaked-render": "error",
			"react/no-unknown-property": "error",
			// Additional a11y rules that complement Biome
			"jsx-a11y/aria-props": "error",
			"jsx-a11y/aria-proptypes": "error",
			"jsx-a11y/aria-unsupported-elements": "error",
			"jsx-a11y/role-has-required-aria-props": "error",
			"jsx-a11y/role-supports-aria-props": "error",
			"jsx-a11y/alt-text": "error",
			"jsx-a11y/img-redundant-alt": "error",
			"jsx-a11y/no-access-key": "error",
			"jsx-a11y/no-redundant-roles": "error",
			"jsx-a11y/anchor-has-content": "error",
			"jsx-a11y/anchor-is-valid": [
				"error",
				{
					components: ["Link"],
					specialLink: ["hrefLeft", "hrefRight"],
					aspects: ["invalidHref", "preferButton"],
				},
			],
			"jsx-a11y/aria-activedescendant-has-tabindex": "error",
			"jsx-a11y/iframe-has-title": "error",
			"jsx-a11y/no-autofocus": [
				"error",
				{
					ignoreNonDOM: true,
				},
			],
			"jsx-a11y/no-noninteractive-tabindex": "error",
		},
	},
	// Separate config for Next.js page files with relaxed import ordering
	{
		files: ["**/app/**/page.tsx", "**/pages/**/*.tsx"],
		rules: {
			"import/order": "off", // Disable strict import ordering for page files
		},
	},
	// Disable import ordering for configuration and setup files
	{
		files: [
			"**/vitest.config.ts",
			"**/vitest.config.js",
			"**/next.config.ts",
			"**/next.config.js",
			"**/next.config.mjs",
			"**/setup.ts",
			"**/test.setup.ts",
			"**/*.setup.ts",
		],
		rules: {
			"import/order": "off",
		},
	},
];
