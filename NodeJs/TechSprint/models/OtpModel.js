import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_EXPIRY } from "../ENV.js";
import bcrypt from "bcrypt";
import OTPTYPE from "../Enums/OtpTypes.js";

const { Schema } = mongoose;

const otpSchema = new Schema({
  otp: { type: String, required: [true, "OTP is required"] },
  type: {
    type: String,
    enum: Object.values(OTPTYPE),
    required: [true, "OTP type is required"],
  },
  mailId: { type: String, required: [true, "Email ID is required"] },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Automatically remove documents after 600 seconds (10 minutes)
  },
});

// Ensure the enum values are accessible for use
Object.assign(otpSchema.statics, { OTPTYPE });

// middelwares
otpSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});

// compare otp
otpSchema.methods.compareotp = async function (userOtp) {
  const isMatch = await bcrypt.compare(userOtp, this.otp);
  return isMatch;
};

//JSON WEBTOKEN
otpSchema.methods.createJWT = function () {
  return JWT.sign({ otpId: this._id }, JWT_SECRET, {
    expiresIn: "10m",
  });
};

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
