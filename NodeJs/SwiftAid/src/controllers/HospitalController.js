import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Hospital } from "../models/HospitalModel.js";
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper.js";

// Controller function for user signup
export const signup = async (req, res) => {
  try {
    // Extract required user data from request body
    const { name, email, password } = req.body;

    // Check if any required fields are missing
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Fullname, email, and password are required",
      });
    }

    // Check if the email is already registered
    const existingUser = await Hospital.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Hospital already exists with this email" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance
    const newUser = new Hospital({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password: hashedPassword,
      accountType: "Hospital",
    });

    // Save the user to the database
    const result = await newUser.save();

    const token = await jwtToken(result);
    const userData = {
      _id: result._id,
      name: result.name,
      email: result.email,
      photo: result.photo,
      accountType: "Hospital",
    };

    // Return success response
    res.status(201).json({
      message: "Hospital registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const login = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email, and password are required",
      });
    }
    // Check if the user exists in the database
    const user = await Hospital.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user || user.isDeleted) {
      return res
        .status(404)
        .json({ message: "Hospital not found or user is deleted" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for authentication
    const token = await jwtToken(user);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      accountType: "Hospital",
    };

    res
      .status(200)
      .json({ message: "Login successful", token, user: userData });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getHospitalById = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.id;

    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const tokenStatus = await verifyToken(req, res, userId);
    if (tokenStatus === false) {
      return res.status(401).json({ message: "Unauthorized" });
    } else if (tokenStatus === "missing") {
      return res.status(401).json({ message: "Access token is missing" });
    }

    // Find the user by ID in the database
    const user = await Hospital.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // omit password
    const { password, ...userData } = user.toObject();

    // Return the user details
    res.status(200).json({ message: "found", user: userData });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateHospital = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.id;

    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Verify access token
    const tokenStatus = await verifyToken(req, res, userId);
    if (tokenStatus === false) {
      return res.status(401).json({ message: "Unauthorized" });
    } else if (tokenStatus === "missing") {
      return res.status(401).json({ message: "Access token is missing" });
    }

    // Find the user by ID in the database
    let user = await Hospital.findById(userId);

    // Check if the user exists
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Update user fields based on request body
    const { name, email, phone, address, photo } = req.body;

    // Update only the fields that are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (photo) user.photo = photo;

    // Save the updated user to the database
    user = await user.save();

    const { password, ...userData } = user.toObject();

    // Return success response with updated user details
    res
      .status(200)
      .json({ message: "Hospital updated successfully", user: userData });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const countHospitals = async (req, res) => {
  try {
    // Count the number of active users in the database (excluding deleted users)
    const userCount = await Hospital.countDocuments({ isDeleted: false });

    // Return success response with the user count
    res.status(200).json({
      message: "Active user count retrieved successfully",
      count: userCount,
    });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

const jwtToken = async (user) => {
  const accessToken = signAccessToken({
    userId: user._id,
  });

  // const refreshToken = signRefreshToken({
  //   userId: user._id,
  // });

  const refreshToken = null;

  return { accessToken, refreshToken };
};

export const verifyToken = async (req, res, userId) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return "missing";
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    if (!decoded || decoded.userId !== userId) {
      return false;
    }
    return true;
  } catch (error) {
    // If an error occurs during token verification
    return false;
  }
};
