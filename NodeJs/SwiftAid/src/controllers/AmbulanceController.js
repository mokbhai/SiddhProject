import { location } from "@hapi/joi/lib/trace.js";
import { Ambulance } from "../models/AmbulanceModel.js";
import { Hospital } from "../models/HospitalModel.js";
import mongoose from "mongoose";

// Controller function to create a new ambulance
const createAmbulance = async (req, res) => {
  try {
    const { vehicleDetails, number, hospitalId } = new Ambulance(req.body);

    if (!number || !vehicleDetails || !hospitalId) {
      res.status(400).json({ message: "All feilds are required" });
    }

    // Check if the ambulance is already registered
    const existingAmbulance = await Ambulance.findOne({ number: number });
    if (existingAmbulance) {
      return res
        .status(400)
        .json({ message: "Ambulance already exists with this number" });
    }

    // const tokenStatus = await verifyToken(req, res, hospitalId);
    // if (tokenStatus === false) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // } else if (tokenStatus === "missing") {
    //   return res.status(401).json({ message: "Access token is missing" });
    // }

    const newAmbulance = new Ambulance({
      _id: new mongoose.Types.ObjectId(),
      vehicleDetails,
      number,
      hospitalId,
    });

    const result = await newAmbulance.save();

    UpdateAmbulanceIdInHospital(hospitalId, result._id);

    res.status(201).json({ message: "Ambulance added succsfully", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all ambulances
const getAllAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find()
      .populate("hospitalId")
      .populate("driverId");
    res.status(200).json(ambulances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAmbulancesByHospitalId = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Find the hospital by ID and populate the ambulanceId field
    const hospital = await Hospital.findById(hospitalId).populate(
      "ambulanceId"
    );

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Extract ambulance details from the populated field
    const ambulances = hospital.ambulanceId.map((ambulance) =>
      ambulance.toObject()
    );

    res.status(200).json(ambulances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get ambulance by ID
const getAmbulanceById = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.ambulanceId);
    if (!ambulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }
    res.status(200).json(ambulance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAmbulanceByIdFunction = async (id) => {
  try {
    const ambulance = await Ambulance.findById(id);
    if (!ambulance) {
      return { message: "Ambulance not found" };
    }
    return ambulance;
  } catch (error) {
    return { message: error.message };
  }
};

// Controller function to update ambulance by ID
const updateAmbulanceById = async (req, res) => {
  try {
    const { ambulanceId } = req.params;
    const ambulance = await Ambulance.findByIdAndUpdate(ambulanceId, req.body, {
      new: true,
    });
    if (!ambulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }
    res.status(200).json(ambulance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAmbulanceStatus = async (req, res) => {
  try {
    const { ambulanceId } = req.params;
    const { isOccupied } = req.body;

    // Find the ambulance by ID
    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    // Update theisOccupied of the ambulance
    ambulance.status = isOccupied;

    // Save the ambulance document with the updatedisOccupied
    await ambulance.save();

    res.status(200).json({ message: "AmbulanceisOccupied updated", ambulance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete ambulance by ID
const deleteAmbulanceById = async (req, res) => {
  try {
    const { ambulanceId } = req.params;
    const { hospitalId } = req.body;
    const ambulance = await Ambulance.findById(ambulanceId);
    if (!ambulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }
    ambulance.isDeleted = true;
    ambulance.deletedAt = new Date();

    await ambulance.save();

    DeleteAmbulanceIdFromHospital(hospitalId, ambulanceId);

    res.status(200).json({ message: "Ambulance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateAmbulanceIdInHospital = async (hospitalId, ambulanceId) => {
  try {
    // Find the hospital document by ID
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      throw new Error("Hospital not found");
    }

    // Push the ambulance ID to ambulanceId array
    const newAmbulanceDetails = hospital.ambulanceId;
    newAmbulanceDetails.push(ambulanceId);

    hospital.ambulanceId = newAmbulanceDetails;

    // Save the updated hospital document
    await hospital.save();

    return hospital;
  } catch (error) {
    throw new Error(
      "Failed to update ambulance ID in hospital: " + error.message
    );
  }
};

const DeleteAmbulanceIdFromHospital = async (hospitalId, ambulanceId) => {
  try {
    // Find the hospital document by ID
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      throw new Error("Hospital not found");
    }

    // Remove the ambulance ID from the ambulanceId array
    hospital.ambulanceId = hospital.ambulanceId.filter(
      (id) => id !== ambulanceId
    );

    // Save the updated hospital document
    await hospital.save();

    return hospital; // Return the updated hospital document if needed
  } catch (error) {
    throw new Error(
      "Failed to delete ambulance ID from hospital: " + error.message
    );
  }
};

const countAmbulances = async (req, res) => {
  try {
    // Count the number of active users in the database (excluding deleted users)
    const ambulanceCount = await Ambulance.countDocuments({ isDeleted: false });

    // Return success response with the Ambulance count
    res.status(200).json({
      message: "Active Ambulance count retrieved successfully",
      count: ambulanceCount,
    });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: error.message });
  }
};

export {
  countAmbulances,
  createAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  updateAmbulanceById,
  deleteAmbulanceById,
  getAllAmbulancesByHospitalId,
  updateAmbulanceStatus,
};

const verifyToken = async (req, res, userId) => {
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
