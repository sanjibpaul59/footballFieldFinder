import mongoose from "mongoose"

const SlotSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, "Cost of Slot is required"],
  },
  bookingStatus: {
    type: Boolean,
    default: false,
  },
  day: {
    type: String,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  startDate: {
    type: Date,
    // required: [true, "Start Time is required"],
  },
  endDate: {
    type: Date,
    // required: [true, "End Time is required"],
  },
  startTime: {
    type: Date,
    required: [true, "Start Time is required"],
  },
  endTime: {
    type: Date,
    required: [true, "End Time is required"],
  },
  duration: {
    type: Number,
    default: null,
  },
})

export default mongoose.model("Slot", SlotSchema)
