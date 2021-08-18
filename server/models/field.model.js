import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  fieldSize: {
    type: String,
    required: [true, "Field Size for the slot is required"],
  },
  booked: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: [true, "Price must be added for each slot"],
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Slot = mongoose.model("Slot", SlotSchema);

const FieldSchema = new mongoose.Schema({
  bin: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length === 13 ? true : false;
      },
      message: (props) =>
        `${props.value} is not a valid Business Identification Number`,
    },
    required: [true, "Business Identification Number is Required"],
  },
  fieldName: {
    type: String,
    required: [true, "Field name is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  description: {
    type: String,
    required: [true, "Details required"],
  },
  image: {
    type: Buffer,
    contentType: String,
    // required: [true, "Please Upload an image of your field"],
  },
  fieldType: {
    type: String,
    required: [true, "Field Type is required"],
  },
  openForBooking: {
    type: Boolean,
    default: false,
  },
  fieldOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  facilities: {
    type: Array,
    of: String,
  },
  slots: [SlotSchema],
  created: Date,
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Field", FieldSchema);
