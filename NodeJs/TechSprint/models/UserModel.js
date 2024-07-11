import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_EXPIRY } from "../ENV.js";

// Define the base user schema
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: [true, "Fullname is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is require"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    phone: { type: String, default: "" },
    accountType: { type: String, default: "Admin" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// middelwares
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, JWT_SECRET, {
    expiresIn: JWT_SECRET_EXPIRY,
  });
};

// Create the base User model
const User = mongoose.model("User", userSchema);

export default User;
