const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated, ensureRole } = require("../middleware/auth");

// All user routes should be protected and accessible only by admin
router.use(ensureAuthenticated, ensureRole("admin"));

// Get all users
router.get("/", userController.getAllUsers);

// Get user creation form
router.get("/create", userController.getCreateUser);

// Create new user
router.post("/create", userController.createUser);

// Get user edit form
router.get("/edit/:id", userController.getEditUser);

// Update user
router.post("/edit/:id", userController.updateUser);

// Delete user
router.post("/delete/:id", userController.deleteUser);

module.exports = router;
