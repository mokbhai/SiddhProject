import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    photo: { type: String },
    accountType: { type: String, default: "Hospital" },
    ambulanceId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

export { Hospital };
