import mongoose from "mongoose";
import { User } from "../models/UserModel.js";
const FamilyDetail = mongoose.model("FamilyDetail");

// Create a new family detail
export const createFamilyDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, address, email, profession, relation, phone } = req.body;

    const familyDetail = new FamilyDetail({
      _id: new mongoose.Types.ObjectId(),
      name,
      address,
      email,
      profession,
      relation,
      phone,
    });
    const savedFamilyDetail = await familyDetail.save();
    getUserById(userId, familyDetail._id);
    res.status(201).json(savedFamilyDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (userId, familyId) => {
  try {
    // Extract user ID from request parameters
    // Check if the provided user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { message: "Invalid user ID" };
    }

    // Find the user by ID in the database
    const user = await User.findById(userId);

    user.familyIds.push(familyId);

    await user.save();

    // Return the user details
    return { message: "found", user: userData };
  } catch (error) {
    // Return error response
    return { message: "Internal server error" };
  }
};
// Get all family details
export const getAllFamilyDetails = async (req, res) => {
  try {
    const familyDetails = await FamilyDetail.find();
    res.json(familyDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific family detail by ID
export const getFamilyDetailById = async (req, res) => {
  try {
    const familyDetail = await FamilyDetail.findById(req.params.id);
    familyDetail
      ? res.json(familyDetail)
      : res.status(404).json({ message: "Family detail not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a family detail by ID
export const updateFamilyDetail = async (req, res) => {
  try {
    const updatedFamilyDetail = await FamilyDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    updatedFamilyDetail
      ? res.json(updatedFamilyDetail)
      : res.status(404).json({ message: "Family detail not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete a family detail by ID
export const deleteFamilyDetail = async (req, res) => {
  try {
    const deletedFamilyDetail = await FamilyDetail.findByIdAndDelete(
      req.params.id
    );
    deletedFamilyDetail
      ? res.json({ message: "Family detail deleted" })
      : res.status(404).json({ message: "Family detail not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
