import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    eventName: { type: String, required: [true, "Event name is required"] },
    eventType: { type: String, required: [true, "Event name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Photos is required"],
      },
    ],
    organiserName: {
      type: String,
      required: [true, "Organiser name is required"],
    },
    location: {
      landmark: { type: String, required: [true, "Landmark is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      country: { type: String, required: [true, "Country is required"] },
    },
    date: {
      duration: { type: Number },
      startDate: { type: Date, required: [true, "Start date is required"] },
      endDate: { type: Date, required: [true, "End date is required"] },
      lastDateOfRegistration: {
        type: Date,
        required: [true, "Last date of registration is required"],
      },
    },
    eligibilities: [
      { type: String, required: [true, "eligibilities are required"] },
    ],
    rules: [{ type: String, required: [true, "Rules are required"] }],
    ruleBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: [true, "Rules are required"],
    },
    contact: [
      {
        name: {
          type: String,
          required: [true, "Contact Information is required"],
        },
        phone: {
          type: String,
          required: [true, "Contact Information is required"],
        },
      },
    ],
    registrationCharges: [
      {
        name: {
          type: String,
          required: [true, "Charges Information is required"],
          default: "Registration Charge",
        },
        currency: {
          type: String,
          required: [true, "Charges Information is required"],
          default: "INR",
        },
        amount: {
          type: String,
          required: [true, "Charges Information is required"],
          default: "0",
        },
        isMandatory: {
          type: Boolean,
          required: [true, "Charges Information is required"],
          default: false,
        },
      },
    ],
    uplodedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre("save", function (next) {
  if (this.date.startDate && this.date.endDate) {
    const start = new Date(this.date.startDate);
    const end = new Date(this.date.endDate);
    const duration = Math.abs(end - start) / 36e5;
    this.date.duration = duration;
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
