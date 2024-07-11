import express from "express";
import {
  createEmergency,
  getEmergencies,
  countActiveEmergencies,
  countSolvedEmergencies,
  getEmergencyById,
} from "../controllers/EmergencyController.js";

const router = express.Router();

// Route for user signup
router.post("/create", createEmergency);

// Route for getEmergencies
router.post("/get", getEmergencies);

// Count emergency
router.get("/count/notDeleted", countActiveEmergencies);
router.get("/count/solved", countSolvedEmergencies);

// Route for getEmergencyById
router.get("/:id", getEmergencyById);

export default router;
