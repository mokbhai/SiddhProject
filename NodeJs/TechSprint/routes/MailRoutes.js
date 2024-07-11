import express from "express";
import { sendMailController } from "../controllers/MailController.js";

const router = express.Router();

// Route for UpdateUserById
router.post("/", sendMailController);

export default router;
