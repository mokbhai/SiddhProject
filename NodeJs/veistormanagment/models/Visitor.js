const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    company: String,
    purpose: {
      type: String,
      required: true,
    },
    hostEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "checked-in", "checked-out"],
      default: "pending",
    },
    photo: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Visitor", visitorSchema);
