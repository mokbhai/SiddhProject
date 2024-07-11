import mongoose from "mongoose";

const { Schema } = mongoose;

const ContactUsSchema = new Schema(
  {
    fullname: { type: String, required: [true, "Name is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    email: { type: String, required: [true, "Email is required"] },
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Photos is required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ContactUsModel = mongoose.model("ContactUs", ContactUsSchema);

const MessageSchema = new Schema(
  {
    phone: { type: String, required: [true, "Phone number is required"] },
    email: { type: String, required: [true, "Email is required"] },
    message: {
      type: String,
      required: [true, "message is required"],
    },
    isReaded: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model("Messages", MessageSchema);

export default ContactUsModel;
