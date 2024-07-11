import express from "express";
import {
  signup,
  login,
  getUserById,
  updateUser,
  getUsername,
  countUsers,
} from "../controllers/UserController.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Count users
router.get("/count", countUsers);

// Route for GetUserById
router.get("/:id", getUserById);

// Route for UpdateUserById
router.post("/update/:id", updateUser);

// Route for GetUsername
router.get("/uname/:username", getUsername);

export default router;
