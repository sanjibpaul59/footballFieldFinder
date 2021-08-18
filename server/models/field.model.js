import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

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
    autopopulate: true,
  },
  facilities: {
    type: Array,
    of: String,
  },
  created: Date,
  updated: {
    type: Date,
    default: Date.now,
  },
});
FieldSchema.plugin(autopopulate);
export default mongoose.model("Field", FieldSchema);
