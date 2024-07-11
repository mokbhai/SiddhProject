import { Schema, model } from "mongoose";

const registrationSchema = new Schema({
  // Self
  fullname: { type: String, required: [true, "Fullname is required"] },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["Male", "Female", "Other"],
      message: "{VALUE} is not supported",
    },
  },
  phoneNumber: { type: String, required: [true, "Phone number is required"] },
  email: { type: String, required: [true, "Email is required"] },

  // Team
  isTeam: { type: Boolean, default: false },
  team: [
    {
      fullname: {
        type: String,
        required: [true, "Fullname of teammate is required"],
      },
      gender: {
        type: String,
        required: [true, "Gender of teammate is required"],
        enum: {
          values: ["Male", "Female", "Other", "Rather not say"],
          message: "{VALUE} is not supported",
        },
      },
      phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
      },
      email: { type: String, required: [true, "Email is required"] },
    },
  ],

  // Payment
  paymentStatus: {
    type: String,
    required: [true, "Payment Status is required"],
    enum: {
      values: ["Completed", "Pending", "Failed", "Refundend"],
      message: "{VALUE} is not supported",
    },
    default: "Pending",
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: "Recipt",
    required: false,
  },

  // Opt Services
  eventIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
  ],
  optAccomodation: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

//JSON WEBTOKEN
registrationSchema.methods.createJWT = function () {
  return JWT.sign(
    { _id: this._id, email: this.email, fullname: this.fullname },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

export default model("Registration", registrationSchema);
