import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    number: { type: String, required: true },
    photo: { type: String },
    vehicleDetails: { type: String, required: true },
    driverId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    isOccupied: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);

export { Ambulance };
