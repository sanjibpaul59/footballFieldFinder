import mongoose from "mongoose"

const SlotSchema = new mongoose.Schema({
  ofDate: {
    type: Date,
    required: [true, "Slot Date is required"],
  },
  day: {
    type: String,
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

const Slot = mongoose.model("Slot", SlotSchema)

const FieldSchema = new mongoose.Schema({
  bin: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length === 13 ? true : false
      },
      message: (props) =>
        `${props.value} is not a valid Business Identification Number`,
    },
    required: [true, "Business Identification Number is Required"],
  },
  fieldName: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Field name is required"],
  },
  location: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Location is required"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Details required"],
  },
  image: {
    data: Buffer,
    contentType: String,
    // required: [true, "Please Upload an image of your field"],
  },
  fieldType: {
    type: String,
    required: [true, "Field Type is required"],
  },
  fieldSize: {
    type: String,
    required: [true, "Field size is required"],
  },
  openForBooking: {
    type: Boolean,
    default: false,
  },
  fieldOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  slots: [SlotSchema],
  facilities: [
    {
      type: String,
      required: [true, "Please Add available facilities to proceed."],
    },
  ],
  created: Date,
  updated: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Field", FieldSchema)
