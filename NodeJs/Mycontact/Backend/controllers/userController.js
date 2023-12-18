const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { statusCodes } = require("../enums/statusCodes");
const bcrypt = require("bcrypt");

class userController {
    //@desc register user
    //@route POST /api/user/register
    registerUser = asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(statusCodes.BAD_REQUEST);
            throw new Error("All feils are mendatory");
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(statusCodes.BAD_REQUEST);
            throw new Error("User already exists for the email");
        }

        existingUser = await User.findOne({ username });

        if (existingUser) {
            res.status(statusCodes.BAD_REQUEST);
            throw new Error("Username is already taken");
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(statusCodes.CREATED).json({
                id: user.id,
                username: user.username,
                email: user.email,
            });
        }
        else {
            res.status(statusCodes.BAD_REQUEST);
            throw new Error("user data is not valid");
        }
    });

    //@desc Login user
    //@route POST /api/user/login
    loginUser = asyncHandler(async (req, res) => {
        // condition for user login
    });

    //@desc current user
    //@route GET /api/user/currents
    currentUser = asyncHandler(async (req, res) => {
        // show currrent user info
    });
};


module.exports = {
    userController
};