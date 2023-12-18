const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add username"],
      unique: [true, "Username should be unique"],
    },
    email: {
      type: String,
      required: [true, "please add email address"],
      unique: [true, "Email id should be unique"],
    },
    password: {
      type: String,
      required: [true, "please add password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
