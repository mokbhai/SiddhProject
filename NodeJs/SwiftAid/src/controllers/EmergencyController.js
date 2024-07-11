import { Emergency } from "../models/EmergecyModel.js";

export const createEmergency = async (req, res) => {
  try {
    const { ambulanceId, userId, description, location } = req.body;

    // Create a new emergency instance
    const newEmergency = new Emergency({
      _id: new mongoose.Types.ObjectId(),
      ambulanceId,
      userId,
      description,
      location,
    });

    // Save the new emergency instance to the database
    const savedEmergency = await newEmergency.save();

    res.status(201).json(savedEmergency);
  } catch (error) {
    console.error("Error creating emergency:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmergencies = async (req, res) => {
  try {
    // Retrieve all emergencies from the database
    const emergencies = await Emergency.find({ isDeleted: false })
      .populate("ambulanceId")
      .populate("userId");

    res.status(200).json(emergencies);
  } catch (error) {
    console.error("Error getting emergencies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmergencyById = async (req, res) => {
  try {
    // Extract the emergency ID from the request parameters
    const { id } = req.params;

    // Find the emergency in the database by its ID
    const emergency = await Emergency.findById(id)
      .populate("ambulanceId")
      .populate("userId");

    // If the emergency with the provided ID is not found, return a 404 error
    if (!emergency) {
      return res.status(404).json({ error: "Emergency not found" });
    }

    // If the emergency is found, return it in the response
    res.status(200).json(emergency);
  } catch (error) {
    console.error("Error getting emergency by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const countActiveEmergencies = async (req, res) => {
  try {
    // Count the number of emergencies where isDeleted is false
    const count = await Emergency.countDocuments({ isDeleted: false });

    // Return the count in the response
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting active emergencies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const countSolvedEmergencies = async (req, res) => {
  try {
    // Count the number of emergencies where isDeleted is false
    const count = await Emergency.countDocuments({ isSolved: false });

    // Return the count in the response
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting active emergencies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
