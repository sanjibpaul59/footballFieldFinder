import mongoose from "mongoose"

const CartItemSchema = new mongoose.Schema({
  slot: { type: mongoose.Schema.ObjectId, ref: "Slot" },
  field: { type: mongoose.Schema.ObjectId, ref: "Field" },
  bookedOn: Date,
  status: {
    type: String,
    default: "Not Processed",
    enum: ["Not Processed", "Processing", "Booked", "Canceled"],
  },
})
const CartItem = mongoose.model("CartItem", CartItemSchema)
const BookingSchema = new mongoose.Schema({
  slots: [CartItemSchema],
  player_name: {
    type: String,
    trim: true,
    required: [true, "Name is Required"],
  },
  player_email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  payment_id: {},
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  field_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const Booking = mongoose.model("Booking", BookingSchema)
export default { Booking, CartItem }
