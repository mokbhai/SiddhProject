import express from "express";
import {
  signup,
  login,
  getUserById,
  updateUser,
  getUsername,
  countUsers,
} from "../controllers/DriverController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Count users
router.get("/count", countUsers);

// Route for UpdateUserById
router.put("/update/:id", updateUser);

// Route for GetUsername
router.get("/uname/:username", getUsername);

// Route for GetUserById
router.get("/:id", getUserById);

export default router;
