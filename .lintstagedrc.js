module.exports = {
	// TypeScript/JavaScript files
	"*.{js,jsx,ts,tsx}": [
		"biome format --write",
		"biome check --apply",
		"eslint --fix",
		() => "tsc --noEmit", // Run type-checking on staged files
	],
	// Style files
	"*.{css,scss}": [
		"biome format --write",
		"biome check --apply",
		"stylelint --fix",
	],
	// Config files
	"*.{json,md,mdx,html,yml,yaml}": [
		"biome format --write",
		"biome check --apply",
	],
	// Ensure no large files are committed
	"*": ["node scripts/prevent-large-files.js"],
};
