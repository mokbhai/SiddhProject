import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Driver } from "../models/DriverModel.js";
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper.js";
import { Ambulance } from "../models/AmbulanceModel.js";

// Controller function for user signup
export const signup = async (req, res) => {
  try {
    const {
      fullname,
      username,
      email,
      password,
      shifts,
      ambulanceId,
      phone,
      hospitalId,
    } = req.body;

    if (!fullname) {
      return res.status(400).json({ message: "Fullname is required" });
    }
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!shifts) {
      return res.status(400).json({ message: "Shifts are required" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!ambulanceId) {
      return res.status(400).json({ message: "Ambulance ID is required" });
    }

    // Check if the username or email is already registered
    const existingUser = await Driver.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Driver already exists with this username or email" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance
    const newUser = new Driver({
      _id: new mongoose.Types.ObjectId(),
      fullname,
      username,
      email,
      password: hashedPassword,
      shifts,
      ambulanceId,
      phone,
      hospitalId,
    });

    // Save the user to the database
    const result = await newUser.save();

    const token = await jwtToken(result);
    const userData = {
      _id: result._id,
      username: result.username,
      name: result.fullname,
      email: result.email,
      photo: result.photo,
      accountType: "Driver",
    };

    updateAmbulanceDriver(ambulanceId, userData._id);

    // Return success response
    res.status(201).json({
      message: "Driver registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateAmbulanceDriver = async (ambulanceId, driverId) => {
  try {
    // Find the ambulance by ID
    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    // Update theisOccupied of the ambulance
    ambulance.driverId.push(driverId);

    // Save the ambulance document with the updatedisOccupied
    await ambulance.save();

    return { message: "AmbulanceisOccupied updated", ambulance };
  } catch (error) {
    return { message: error.message };
  }
};

export const login = async (req, res) => {
  try {
    // Extract username and password from request body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email, and password are required",
      });
    }
    // Check if the user exists in the database
    const user = await Driver.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user || user.isDeleted) {
      return res
        .status(404)
        .json({ message: "Driver not found or user is deleted" });
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
      username: user.username,
      name: user.fullname,
      email: user.email,
      photo: user.photo,
      accountType: "Driver",
    };

    res
      .status(200)
      .json({ message: "Login successful", token, user: userData });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getUserById = async (req, res) => {
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
    const user = await Driver.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "Driver not found" });
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

export const getUsername = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const username = req.params.username;

    // Find the user by ID in the database
    const existsUser = await Driver.findOne({ username });
    if (existsUser) {
      return res.status(200).json({ message: "available", existsUser: true });
    } else {
      return res
        .status(200)
        .json({ message: "not available", existsUser: false });
    }
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateUser = async (req, res) => {
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
    let user = await Driver.findById(userId);

    // Check if the user exists
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update user fields based on request body
    const {
      fullname,
      username,
      email,
      phone,
      address,
      photo,
      work,
      familyDetails,
    } = req.body;

    // Update only the fields that are provided
    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (photo) user.photo = photo;
    if (work) user.work = work;
    if (familyDetails) user.familyDetails = familyDetails;
    if (profession) user.profession = profession;

    // Save the updated user to the database
    user = await user.save();

    const { password, ...userData } = user.toObject();

    // Return success response with updated user details
    res
      .status(200)
      .json({ message: "Driver updated successfully", user: userData });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const countUsers = async (req, res) => {
  try {
    // Count the number of active users in the database (excluding deleted users)
    const userCount = await Driver.countDocuments({ isDeleted: false });

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
    username: user.username,
  });

  // const refreshToken = signRefreshToken({
  //   userId: user._id,
  //   username: user.username,
  // });

  const refreshToken = null;

  return { accessToken, refreshToken };
};

const verifyToken = async (req, res, userId) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return "missing";
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyAccessToken(token);
    if (!decoded || decoded.userId !== userId) {
      return false;
    }
    return true;
  } catch (error) {
    // If an error occurs during token verification
    return false;
  }
};
