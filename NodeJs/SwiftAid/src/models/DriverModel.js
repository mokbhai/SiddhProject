import mongoose from "mongoose";

// Define the driver schema inheriting from the base user schema
const driverSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    photo: { type: String },
    accountType: { type: String, default: "Driver" },
    ambulaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    shifts: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  },
  {
    timestamps: true,
  }
);
const Driver = mongoose.model("Driver", driverSchema);

export { Driver };
