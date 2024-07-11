import express from "express";
import {
  getLocationById,
  storeLocation,
  storeLocationInCache,
  deleteLocationById,
  getAllAmbulanceLocationsFromCache,
  getNearestDriverLocation,
  getRangedDriverLocation,
  getAllHospitalsFromCache,
} from "../controllers/LocationController.js";

const router = express.Router();

router.get("/get/ambulances", getAllAmbulanceLocationsFromCache);
router.get("/get/hospitals", getAllHospitalsFromCache);
router.get("/get/nearest/driver", getNearestDriverLocation);
router.get("/get/all/nearest/driver", getRangedDriverLocation);
router.get("/get/:id", getLocationById);

router.post("/post/:id", storeLocation);
router.post("/temp/:id", storeLocationInCache);

router.delete("/delete/:id", deleteLocationById);

export default router;
