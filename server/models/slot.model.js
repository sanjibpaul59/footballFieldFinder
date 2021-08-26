import mongoose from "mongoose"

const SlotSchema = new mongoose.Schema({
  ofDate: {
    type: Date,
    // required: [true, "Start Time is required"],
  },
  day: {
    type: String,
  },
  startTime: {
    type: String,
    required: [true, "Start Time is required"],
  },
  endTime: {
    type: String,
    required: [true, "End Time is required"],
  },
  duration: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    required: [true, "Cost of Slot is required"],
  },

  bookingStatus: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model("Slot", SlotSchema)
