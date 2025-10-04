#!/usr/bin/env node

import * as readline from "readline";
import chalk from "chalk";
import { runUITesting } from "./index";

/**
 * CLI Interface for UI Testing Automation Workflow
 *
 * This module provides an interactive command-line interface for the UI testing workflow.
 * Users can enter prompts directly from the terminal with features like:
 * - Interactive prompt entry
 * - Multi-line input support
 * - Predefined example prompts
 * - Input validation
 * - Colored output for better UX
 */

interface CLIOptions {
  interactive?: boolean;
  prompt?: string;
  examples?: boolean;
  help?: boolean;
}

// Predefined example prompts for quick testing
const EXAMPLE_PROMPTS = [
  {
    name: "GitHub Repository Testing",
    prompt:
      "Test the user interface and navigation of https://github.com - focus on repository browsing, search functionality, and user profile pages",
  },
  {
    name: "React Documentation Testing",
    prompt:
      "Perform comprehensive UI testing on https://react.dev including documentation navigation, interactive examples, and code snippets",
  },
  {
    name: "E-commerce Flow Testing",
    prompt:
      "Test the e-commerce flow on https://shopify.com - check navigation, product browsing, user experience, and responsive design",
  },
  {
    name: "News Website Testing",
    prompt:
      "Test the user interface of https://news.ycombinator.com - focus on article browsing, comment sections, and overall usability",
  },
  {
    name: "Landing Page Testing",
    prompt:
      "Perform UI testing on https://stripe.com - test navigation, form interactions, responsive design, and overall user experience",
  },
];

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.cyan("📝 UI Testing Prompt: "),
});

/**
 * Display welcome message and usage instructions
 */
function displayWelcome() {
  console.log(chalk.bold.blue("\n🤖 UI Testing Automation CLI"));
  console.log(chalk.gray("====================================="));
  console.log(
    chalk.white("Welcome to the interactive UI testing automation tool!")
  );
  console.log(
    chalk.white("Enter your testing prompt with a URL and instructions.\n")
  );

  console.log(chalk.yellow("💡 Example format:"));
  console.log(
    chalk.gray(
      "   Test the UI of https://example.com - focus on navigation and forms\n"
    )
  );

  console.log(chalk.yellow("🎯 Available commands:"));
  console.log(chalk.gray("   !examples  - Show predefined example prompts"));
  console.log(chalk.gray("   !help      - Show this help message"));
  console.log(chalk.gray("   !quit      - Exit the CLI"));
  console.log(chalk.gray("   !clear     - Clear the screen\n"));
}

/**
 * Display help message with detailed instructions
 */
function displayHelp() {
  console.log(chalk.bold.yellow("\n📚 Help - UI Testing CLI"));
  console.log(chalk.gray("==============================="));

  console.log(chalk.white("\n🎯 How to use:"));
  console.log(
    chalk.gray("1. Enter a prompt containing a URL and testing instructions")
  );
  console.log(
    chalk.gray(
      "2. The system will automatically extract the URL and instructions"
    )
  );
  console.log(chalk.gray("3. Comprehensive UI testing will be performed"));
  console.log(chalk.gray("4. A detailed report will be generated and saved"));

  console.log(chalk.white("\n📝 Prompt Format:"));
  console.log(
    chalk.cyan("   Test [description] on [URL] - [specific instructions]")
  );

  console.log(chalk.white("\n🌐 Example prompts:"));
  console.log(
    chalk.gray(
      '   • "Test navigation on https://github.com - check menu and search"'
    )
  );
  console.log(
    chalk.gray(
      '   • "Perform UI testing on https://react.dev - test docs and examples"'
    )
  );
  console.log(
    chalk.gray('   • "Test forms and interactions on https://example.com"')
  );

  console.log(chalk.white("\n🔧 What gets tested:"));
  console.log(chalk.gray("   • Navigation and menu functionality"));
  console.log(chalk.gray("   • Forms and interactive elements"));
  console.log(chalk.gray("   • Content layout and responsiveness"));
  console.log(chalk.gray("   • User experience and accessibility"));
  console.log(chalk.gray("   • Performance and loading behavior"));

  console.log(chalk.white("\n📊 Output:"));
  console.log(chalk.gray("   • Live console feedback during testing"));
  console.log(chalk.gray("   • Browser window for visual verification"));
  console.log(chalk.gray("   • Detailed report saved to ./summary/ directory"));
  console.log(chalk.gray("   • Professional markdown report with insights\n"));
}

/**
 * Display predefined example prompts for user selection
 */
function displayExamples() {
  console.log(chalk.bold.green("\n🎯 Example Testing Prompts"));
  console.log(chalk.gray("============================"));

  EXAMPLE_PROMPTS.forEach((example, index) => {
    console.log(chalk.yellow(`\n${index + 1}. ${example.name}:`));
    console.log(chalk.gray(`   ${example.prompt}`));
  });

  console.log(chalk.white("\n💡 To use an example:"));
  console.log(
    chalk.gray("   Type the number (1-5) or copy/paste the prompt text\n")
  );
}

/**
 * Validate user input and extract URL
 */
function validateInput(input: string): {
  isValid: boolean;
  url?: string;
  error?: string;
} {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return { isValid: false, error: "Please enter a testing prompt" };
  }

  // Check for URL in the input
  const urlMatch = trimmedInput.match(/(https?:\/\/[^\s]+)/);
  if (!urlMatch) {
    return {
      isValid: false,
      error:
        "Please include a valid URL (starting with http:// or https://) in your prompt",
    };
  }

  const url = urlMatch[1];

  // Basic URL validation
  try {
    new URL(url);
    return { isValid: true, url };
  } catch {
    return {
      isValid: false,
      error: "The URL provided appears to be invalid. Please check the format.",
    };
  }
}

/**
 * Process user input and handle commands or execute testing
 */
async function processInput(input: string): Promise<boolean> {
  const trimmedInput = input.trim().toLowerCase();

  // Handle special commands
  if (trimmedInput.startsWith("!")) {
    switch (trimmedInput) {
      case "!help":
        displayHelp();
        return false;

      case "!examples":
        displayExamples();
        return false;

      case "!quit":
      case "!exit":
        console.log(
          chalk.yellow(
            "\n👋 Goodbye! Thank you for using UI Testing Automation CLI."
          )
        );
        return true;

      case "!clear":
        console.clear();
        displayWelcome();
        return false;

      default:
        console.log(chalk.red(`\n❌ Unknown command: ${input}`));
        console.log(chalk.gray("Type !help for available commands\n"));
        return false;
    }
  }

  // Handle example selection by number
  if (/^\d+$/.test(trimmedInput)) {
    const exampleIndex = parseInt(trimmedInput) - 1;
    if (exampleIndex >= 0 && exampleIndex < EXAMPLE_PROMPTS.length) {
      const selectedExample = EXAMPLE_PROMPTS[exampleIndex];
      console.log(chalk.green(`\n✅ Selected: ${selectedExample.name}`));
      console.log(chalk.gray(`Prompt: ${selectedExample.prompt}\n`));

      return await executeUITesting(selectedExample.prompt);
    } else {
      console.log(
        chalk.red(
          `\n❌ Invalid example number. Please choose 1-${EXAMPLE_PROMPTS.length}\n`
        )
      );
      return false;
    }
  }

  // Validate and execute UI testing
  const validation = validateInput(input);
  if (!validation.isValid) {
    console.log(chalk.red(`\n❌ ${validation.error}\n`));
    console.log(chalk.yellow("💡 Example format:"));
    console.log(
      chalk.gray(
        "   Test the UI of https://example.com - focus on navigation and forms\n"
      )
    );
    return false;
  }

  return await executeUITesting(input);
}

/**
 * Execute UI testing with the provided prompt
 */
async function executeUITesting(prompt: string): Promise<boolean> {
  try {
    console.log(chalk.blue("\n🚀 Starting UI Testing Automation..."));
    console.log(chalk.gray(`📝 Prompt: ${prompt}\n`));

    // Run the UI testing workflow
    await runUITesting(prompt);

    console.log(chalk.green("\n✅ UI Testing completed successfully!"));
    console.log(
      chalk.gray("📊 Check the generated report in ./summary/ directory")
    );
    console.log(
      chalk.gray("🌐 Browser window remains open for manual review\n")
    );

    return true; // Exit after successful completion
  } catch (error) {
    console.log(chalk.red("\n❌ UI Testing failed:"));
    console.log(
      chalk.gray(error instanceof Error ? error.message : String(error))
    );
    console.log(
      chalk.yellow("\n💡 You can try again with a different prompt\n")
    );
    return false; // Don't exit, allow retry
  }
}

/**
 * Start interactive CLI session
 */
function startInteractiveMode() {
  displayWelcome();

  rl.prompt();

  rl.on("line", async (input) => {
    const shouldExit = await processInput(input);

    if (shouldExit) {
      rl.close();
      process.exit(0);
    } else {
      rl.prompt();
    }
  });

  rl.on("close", () => {
    console.log(chalk.yellow("\n👋 Goodbye!"));
    process.exit(0);
  });

  // Handle Ctrl+C
  rl.on("SIGINT", () => {
    console.log(chalk.yellow("\n\n👋 Goodbye!"));
    process.exit(0);
  });
}

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-h":
      case "--help":
        options.help = true;
        break;

      case "-i":
      case "--interactive":
        options.interactive = true;
        break;

      case "-e":
      case "--examples":
        options.examples = true;
        break;

      case "-p":
      case "--prompt":
        if (i + 1 < args.length) {
          options.prompt = args[++i];
        }
        break;

      default:
        // If no flag, treat as prompt
        if (!arg.startsWith("-")) {
          options.prompt = args.slice(i).join(" ");
          break;
        }
    }
  }

  return options;
}

/**
 * Display CLI usage information
 */
function displayUsage() {
  console.log(chalk.bold.blue("\n🤖 UI Testing Automation CLI"));
  console.log(chalk.gray("====================================="));

  console.log(chalk.white("\nUsage:"));
  console.log(chalk.cyan("  npm run ui-test [options] [prompt]"));
  console.log(chalk.cyan("  node cli.js [options] [prompt]"));

  console.log(chalk.white("\nOptions:"));
  console.log(
    chalk.yellow("  -i, --interactive   Start interactive mode (default)")
  );
  console.log(chalk.yellow("  -p, --prompt TEXT   Run with specific prompt"));
  console.log(chalk.yellow("  -e, --examples      Show example prompts"));
  console.log(chalk.yellow("  -h, --help          Show this help message"));

  console.log(chalk.white("\nExamples:"));
  console.log(chalk.gray("  # Interactive mode"));
  console.log(chalk.cyan("  npm run ui-test"));

  console.log(chalk.gray("\n  # Direct prompt"));
  console.log(
    chalk.cyan('  npm run ui-test "Test https://github.com navigation"')
  );

  console.log(chalk.gray("\n  # Show examples"));
  console.log(chalk.cyan("  npm run ui-test --examples"));

  console.log(chalk.gray("\n  # Help"));
  console.log(chalk.cyan("  npm run ui-test --help\n"));
}

/**
 * Main CLI entry point
 */
async function main() {
  const options = parseArgs();

  // Handle help flag
  if (options.help) {
    displayUsage();
    process.exit(0);
  }

  // Handle examples flag
  if (options.examples) {
    displayExamples();
    process.exit(0);
  }

  // Handle direct prompt
  if (options.prompt) {
    console.log(chalk.blue("\n🚀 UI Testing Automation CLI"));
    console.log(chalk.gray("=============================="));

    const validation = validateInput(options.prompt);
    if (!validation.isValid) {
      console.log(chalk.red(`\n❌ ${validation.error}`));
      console.log(chalk.yellow("\n💡 Example format:"));
      console.log(
        chalk.gray(
          '   "Test the UI of https://example.com - focus on navigation"\n'
        )
      );
      process.exit(1);
    }

    try {
      await executeUITesting(options.prompt);
      console.log(chalk.green("\n✅ UI Testing completed successfully!"));
    } catch (error) {
      console.log(chalk.red("\n❌ UI Testing failed:"));
      console.log(
        chalk.gray(error instanceof Error ? error.message : String(error))
      );
      process.exit(1);
    }

    return;
  }

  // Default to interactive mode
  startInteractiveMode();
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red("\n💥 CLI Error:"), error);
    process.exit(1);
  });
}

export { main as startCLI, executeUITesting, validateInput, EXAMPLE_PROMPTS };
