#!/usr/bin/env node

import fs from "node:fs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Get staged files from git
const stagedFiles = process.argv.slice(2);

for (const file of stagedFiles) {
	try {
		const stats = fs.statSync(file);
		if (stats.size > MAX_FILE_SIZE) {
			console.error(
				`Error: File ${file} is too large (${(stats.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
			);
			process.exit(1);
		}
	} catch (error) {
		if (error.code !== "ENOENT") {
			console.error(`Error checking file ${file}:`, error);
			process.exit(1);
		}
	}
}

process.exit(0);
