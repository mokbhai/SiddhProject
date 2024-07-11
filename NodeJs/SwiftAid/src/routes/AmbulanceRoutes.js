import express from "express";
import {
  createAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  updateAmbulanceById,
  deleteAmbulanceById,
  getAllAmbulancesByHospitalId,
  updateAmbulanceStatus,
  countAmbulances,
} from "../controllers/AmbulanceController.js";

const router = express.Router();

// Route to create a new ambulance
router.post("/new", createAmbulance);

// Route to get all ambulances
router.get("/", getAllAmbulances);

// Route to get count of active ambulances
router.get("/count", countAmbulances);

// Route to get an ambulance by ID
router.get("/:ambulanceId", getAmbulanceById);

// Route to update an ambulance by ID
router.post("/update/:ambulanceId", updateAmbulanceById);

// Route to delete an ambulance by ID
router.delete("/delete/:ambulanceId", deleteAmbulanceById);

// Route to get all ambulances associated with a hospital by hospital ID
router.get("/of/hospital/:hospitalId", getAllAmbulancesByHospitalId);

// Route to update the status of an ambulance by ID
router.post("/status/:ambulanceId", updateAmbulanceStatus);

export default router;
