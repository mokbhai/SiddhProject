import mongoose from "mongoose";

const EmergencySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
    isSolved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Emergency = mongoose.model("Emergency", EmergencySchema);

export { Emergency };
