import express from "express";
const router = express.Router();
import {
  newRegistration,
  filterRegistrations,
  downloadRegistrations,
} from "../controllers/RegistrationController.js";
import userAuth from "../middlewares/authMiddleware.js";

router.post("/new", newRegistration);
router.post("/filter", userAuth, filterRegistrations);
router.post("/download", userAuth, downloadRegistrations);

export default router;
