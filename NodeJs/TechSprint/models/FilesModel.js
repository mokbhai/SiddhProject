import mongoose from "mongoose";

const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    name: { type: String, required: [true, "File name is required"] },
    type: { type: String, required: [true, "File type is required"] },
    file: { type: String, required: [true, "File is required"] },
    till: {
      type: String,
      default: "Temprary",
      enum: {
        values: ["Temprary", "Permanent"],
        message: "{VALUE} is not supported as a valid relation",
      },
    },
    length: { type: String },
    width: { type: String },
    used: {
      type: String,
      enum: {
        values: [
          "Gallery",
          "RuleBook",
          "EventPhotos",
          "MediaPhotos",
          "ContactUs",
          "AboutUs",
          "Brochure",
        ],
        message: "{VALUE} is not supported as a valid relation",
      },
    },
    uplodedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isdeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("Files", FileSchema);

export default File;
