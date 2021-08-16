import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const FieldSchema = new mongoose.Schema({
  fieldName: {
    type: String,

    required: [true, 'Field name is required'],
  },
  fieldLocation: {
    type: String,

    required: [true, 'Location is required'],
  },
  fieldDetails: {
    type: String,
    required: [true, 'Details required'],
  },
  image: {
    type: Buffer,
    contentType: String,
  },
  openForBooking: {
    type: Boolean,
    default: false,
  },
  fieldOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

export default mongoose.model('Field', FieldSchema);
