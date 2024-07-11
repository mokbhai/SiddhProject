import mongoose from "mongoose";

// Define the base user schema
const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    photo: { type: String },
    profession: { type: String },
    accountType: { type: String, default: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    familyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyDetail" }],
  },
  {
    timestamps: true,
  }
);

// Define the family details schema
const familyDetailSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  email: { type: String },
  profession: { type: String },
  relation: { type: String },
});

// Create the family detail model
const FamilyDetail = mongoose.model("FamilyDetail", familyDetailSchema);

// Create the base User model
const User = mongoose.model("User", userSchema);

export { User, FamilyDetail };
