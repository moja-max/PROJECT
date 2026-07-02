import mongoose from 'mongoose';

const inspectionSchema = new mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    inspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inspectionDate: {
      type: Date,
      required: true,
    },
    weatherConditions: {
      type: String,
      enum: ['Clear / Dry', 'Overcast', 'Wet / Rainy'],
    },
    elementRatings: {
      roof: { type: Number, min: 1, max: 5, required: true },
      walls: { type: Number, min: 1, max: 5, required: true },
      windows: { type: Number, min: 1, max: 5, required: true },
      foundation: { type: Number, min: 1, max: 5, required: true },
      interior: { type: Number, min: 1, max: 5, required: true },
      services: { type: Number, min: 1, max: 5, required: true },
    },
    compositeScore: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    generalNotes: String,
    photos: [String],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'approved'],
      default: 'submitted',
    },
    reviewedBy: mongoose.Schema.Types.ObjectId,
    reviewNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Inspection', inspectionSchema);
