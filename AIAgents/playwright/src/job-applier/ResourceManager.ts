/**
 * Resource Manager for Job Application Automation
 *
 * This utility helps manage MCP clients and prevent memory leaks
 */

import { setMaxListeners } from "events";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

// Configure event listener limits globally
setMaxListeners(25);
process.setMaxListeners(0);

export class ResourceManager {
  private static instance: ResourceManager;
  private mcpClient: MultiServerMCPClient | null = null;
  private intervals: Set<NodeJS.Timeout> = new Set();
  private cleanupHandlers: Set<() => Promise<void> | void> = new Set();

  private constructor() {
    // Set up global cleanup handlers
    process.on("SIGINT", this.cleanup.bind(this));
    process.on("SIGTERM", this.cleanup.bind(this));
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      this.cleanup().then(() => process.exit(1));
    });
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      this.cleanup().then(() => process.exit(1));
    });
  }

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  async getMCPClient(config: any): Promise<MultiServerMCPClient> {
    if (!this.mcpClient) {
      console.log("🔧 Creating new MCP client...");
      this.mcpClient = new MultiServerMCPClient(config);

      // Add cleanup handler for MCP client
      this.addCleanupHandler(async () => {
        if (this.mcpClient) {
          console.log("🧹 Closing MCP client...");
          await this.mcpClient.close();
          this.mcpClient = null;
        }
      });
    }
    return this.mcpClient;
  }

  addInterval(interval: NodeJS.Timeout): void {
    this.intervals.add(interval);
  }

  addCleanupHandler(handler: () => Promise<void> | void): void {
    this.cleanupHandlers.add(handler);
  }

  async cleanup(): Promise<void> {
    console.log("\n🛑 Starting cleanup process...");

    // Clear all intervals
    for (const interval of this.intervals) {
      clearInterval(interval);
    }
    this.intervals.clear();
    console.log("✅ Cleared all intervals");

    // Run all cleanup handlers
    const cleanupPromises = Array.from(this.cleanupHandlers).map(
      async (handler) => {
        try {
          await handler();
        } catch (error) {
          console.warn("Warning: Cleanup handler failed:", error);
        }
      }
    );

    await Promise.allSettled(cleanupPromises);
    this.cleanupHandlers.clear();
    console.log("✅ Cleanup completed");
  }

  // Monitor memory usage
  logMemoryUsage(): void {
    const usage = process.memoryUsage();
    console.log("📊 Memory Usage:", {
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`,
    });
  }
}

export default ResourceManager;
