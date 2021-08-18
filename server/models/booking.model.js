import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
  },
  updated: Date,
  bookedOn: {
    type: Date,
    default: Date.now(),
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookingStatus: [
    {
      slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot",
      },
      complete: Boolean,
    },
  ],
  completed: Boolean,
});

export default mongoose.model("Booking", BookingSchema);
