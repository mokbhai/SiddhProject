import StatusCode from "../Enums/HttpStatusCodes.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const signup = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return next(new Error("Please Provide All Fields"));
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new Error("Email already registered. Please login"));
    }
    if (!password || password.length < 6) {
      return next(
        new Error(
          "Password is required and should be at least 6 characters long"
        )
      );
    }
    const user = await userModel.create({
      fullname,
      email,
      password,
    });
    //token
    const token = user.createJWT();
    res.status(201).send({
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
  // Validation
  if (!email || !password) {
    return next(new Error("Please Provide All Fields"));
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new Error("Invalid email or password"));
    }

    if (user.isDeleted) {
      return next(new Error("Account not found"));
    }

    const isMatch = await user.comparePassword(password);

    // Check if password matches
    if (!isMatch) {
      return next(new Error("Invalid email or password"));
    }

    user.password = undefined;
    const token = user.createJWT();

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    next(error); // Pass error to the error middleware
  }
};

export const getUserById = async (req, res, next) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.id;

    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new Error("Invalid user ID"));
    }

    // Find the user by ID in the database
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user || user.isDeleted) {
      return next(new Error("Account not found"));
    }

    // Omit password from user object
    const { password, ...userData } = user.toObject();

    // Return the user details
    res.status(200).json({ message: "found", user: userData });
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
      const err = new Error("Invalid user ID");
      err.statusCode = StatusCode.BAD_REQUEST;
      return next(err);
    }

    // Find the user by ID in the database
    let user = await userModel.findById(userId);

    // Check if the user exists
    if (!user || user.isDeleted) {
      const err = new Error("Account not found");
      err.statusCode = StatusCode.NOT_FOUND;
      return next(err);
    }

    // Update user fields based on request body
    const { fullname, email } = req.body;

    if (user.email != email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return next(
          new Error("Email already registered. Please use another one")
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
      .status(200)
      .json({ message: "User updated successfully", user: userData });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

//Update PASSWORD
export const changePassword = async (req, res, next) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return next(new Error("Please provide all fields"));
    }

    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new Error("Invalid user ID"));
    }

    // Find the user by ID in the database
    const user = await userModel.findById(userId).select("+password");

    // Check if the user exists
    if (!user || user.isDeleted) {
      return next(new Error("Account not found"));
    }

    // Verify the current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new Error("Current password is incorrect"));
    }

    // Validate the new password
    if (newPassword.length < 6) {
      return next(
        new Error(
          "Password is required and should be at least 6 characters long"
        )
      );
    }

    user.password = newPassword;

    // Save the updated user to the database
    await user.save();

    // Return success response
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
