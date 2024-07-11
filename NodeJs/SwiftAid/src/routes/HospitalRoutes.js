import express from "express";
import {
  signup,
  login,
  getHospitalById,
  updateHospital,
  countHospitals,
} from "../controllers/HospitalController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Count users
router.get("/count", countHospitals);

// Route for GetUserById
router.get("/:id", getHospitalById);

// Route for UpdateUserById
router.post("/update/:id", updateHospital);

export default router;
