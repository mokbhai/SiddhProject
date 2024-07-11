import express from "express";
import { createOtp, verifyOtp } from "../controllers/OtpController.js";
import { otpAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for UpdateUserById
router.post("/create", createOtp);
router.post("/verify", otpAuth, verifyOtp);

export default router;
