import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    lat: { type: String, required: true },
    long: { type: String, required: true },
    accountType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", LocationSchema);

export { Location };
