const express = require("express");
const { userController } = require("../controllers/userController");
const router = express.Router();
const user = new userController;

router.route("/register").post(user.registerUser);

router.route("/login").post(user.loginUser);

router.route("/current").get(user.currentUser);

module.exports = router;