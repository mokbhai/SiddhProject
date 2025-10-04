#!/usr/bin/env node

/**
 * Simple launcher for UI Testing CLI
 * This file can be run directly with node without compilation
 */

const { spawn } = require("child_process");
const path = require("path");

// Get the path to the CLI TypeScript file
const cliPath = path.join(__dirname, "cli.ts");

// Arguments to pass to ts-node
const args = ["--esm", cliPath, ...process.argv.slice(2)];

// Spawn ts-node to run the CLI
const child = spawn("npx", ["ts-node"].concat(args), {
  stdio: "inherit",
  cwd: process.cwd(),
});

// Handle process exit
child.on("close", (code) => {
  process.exit(code);
});

// Handle errors
child.on("error", (error) => {
  console.error("Failed to start UI Testing CLI:", error.message);
  process.exit(1);
});
