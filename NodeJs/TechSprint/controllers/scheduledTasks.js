import cron from "node-cron";
import { deleteTempFiles } from "./FilesController.js";

// Schedule task to run at midnight every day
cron.schedule("0 0 * * *", deleteTempFiles);
