import express from "express";
import {
  createFamilyDetail,
  getFamilyDetailById,
  updateFamilyDetail,
} from "../controllers/UserFamilyDetails.js";

const router = express.Router();

router.post("/create/:id", createFamilyDetail);

// router.get("/getall", getAllFamilyDetails);

router.get("/get/:id", getFamilyDetailById);

// Route for GetUserById
router.post("/update/:id", updateFamilyDetail);

export default router;
