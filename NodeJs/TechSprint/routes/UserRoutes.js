import express from "express";
import {
  signup,
  login,
  getUserById,
  updateUser,
  changePassword,
} from "../controllers/UserController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Route for GetUserById
router.get("/:id", getUserById);

// Route for UpdateUserById
router.post("/update", userAuth, updateUser);

// Route for ChangePassword
router.put("/change-password", userAuth, changePassword);

export default router;
