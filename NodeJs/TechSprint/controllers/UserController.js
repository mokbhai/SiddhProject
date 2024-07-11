import userModel from "../models/UserModel.js";
import mongoose from "mongoose";
import STATUSCODE from "../Enums/HttpStatusCodes.js";
import { sendError, validateFields } from "./ErrorHandler.js";

export const signup = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  try {
    validateFields(
      [
        { field: fullname, message: "Full name is required" },
        { field: email, message: "Email is required" },
        { field: password, message: "Password is required" },
      ],
      next
    );

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return sendError(
        STATUSCODE.BAD_REQUEST,
        "Email already registered. Please login",
        next
      );
    }
    if (!password || password.length < 6) {
      return sendError(
        STATUSCODE.BAD_REQUEST,
        "Password is required and should be at least 6 characters long",
        next
      );
    }
    const user = await userModel.create({
      fullname,
      email,
      password,
    });
    //token
    const token = user.createJWT();
    res.status(STATUSCODE.CREATED).send({
      success: true,
      message: "User created successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    validateFields(
      [
        { field: email, message: "Email is required" },
        { field: password, message: "Password is required" },
      ],
      next
    );

    // Find user by email
    const user = await userModel.findOne({ email }).select("+password");

    if (!user || user.isDeleted) {
      return sendError(STATUSCODE.NOT_FOUND, "Account not found", next);
    }

    const isMatch = await user.comparePassword(password);

    // Check if password matches
    if (!isMatch) {
      return sendError(
        STATUSCODE.BAD_REQUEST,
        "Invalid email or password",
        next
      );
    }

    user.password = undefined;
    const token = user.createJWT();

    res.status(STATUSCODE.OK).json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.id;

    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(STATUSCODE.BAD_REQUEST, "Invalid user ID", next);
    }

    // Find the user by ID in the database
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user || user.isDeleted) {
      return sendError(STATUSCODE.NOT_FOUND, "Account not found", next);
    }

    // Omit password from user object
    const { password, ...userData } = user.toObject();

    // Return the user details
    res.status(STATUSCODE.OK).json({ message: "found", user: userData });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Extract user ID from request parameters
    const { userId } = req.user;

    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(STATUSCODE.BAD_REQUEST, "Invalid user ID", next);
    }

    // Find the user by ID in the database
    let user = await userModel.findById(userId);

    // Check if the user exists
    if (!user || user.isDeleted) {
      return sendError(STATUSCODE.NOT_FOUND, "Account not found", next);
    }

    // Update user fields based on request body
    const { fullname, email } = req.body;

    if (user.email != email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return sendError(
          STATUSCODE.BAD_REQUEST,
          "Email already registered. Please login",
          next
        );
      }
    }
    // Update only the fields that are provided
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;

    // Save the updated user to the database
    user = await user.save();

    const { password, ...userData } = user.toObject();

    // Return success response with updated user details
    res
      .status(STATUSCODE.OK)
      .json({ message: "User updated successfully", user: userData });
  } catch (error) {
    next(error);
  }
};

//Update PASSWORD
export const changePassword = async (req, res, next) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    validateFields(
      [
        { field: userId, message: "User ID is required" },
        { field: currentPassword, message: "Current Password is required" },
        { field: newPassword, message: "New Password is required" },
      ],
      next
    );

    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(STATUSCODE.BAD_REQUEST, "Invalid user ID", next);
    }

    // Find the user by ID in the database
    const user = await userModel.findById(userId).select("+password");

    // Check if the user exists
    if (!user || user.isDeleted) {
      return sendError(STATUSCODE.NOT_FOUND, "Account not found", next);
    }

    // Verify the current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(
        STATUSCODE.BAD_REQUEST,
        "Current password is incorrect",
        next
      );
    }

    // Validate the new password
    if (newPassword.length < 6) {
      return sendError(
        STATUSCODE.BAD_REQUEST,
        "Password is required and should be at least 6 characters long",
        next
      );
    }

    user.password = newPassword;

    // Save the updated user to the database
    await user.save();

    // Return success response
    res
      .status(STATUSCODE.OK)
      .json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
