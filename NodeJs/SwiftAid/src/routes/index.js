import express from "express";
import bot from "../bot/index.js";
import UserRoutes from "./UserRoutes.js";
import UserFamilyRoutes from "./UserFamilyRoutes.js";
import EmergencyRoutes from "./EmergencyRoutes.js";
import DriverRoutes from "./DriverRoutes.js";
import LocationRoutes from "./LocationRoutes.js";
import HospitalRoutes from "./HospitalRoutes.js";
import AmbulanceRoutes from "./AmbulanceRoutes.js";

const router = express.Router();

// Define routes
router.use("/bot", bot);
router.use("/users", UserRoutes);
router.use("/users/family", UserFamilyRoutes);
router.use("/emergency", EmergencyRoutes);
router.use("/drivers", DriverRoutes);
router.use("/locations", LocationRoutes);
router.use("/hospitals", HospitalRoutes);
router.use("/ambulances", AmbulanceRoutes);

export default router;
