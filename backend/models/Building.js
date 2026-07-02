import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^DSM-HB-\d{3}$/,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: String,
    historicalStyle: {
      type: String,
      enum: [
        'Colonial Gothic',
        'Neo-Classical',
        'Gothic Revival',
        'Swahili-German',
        'Indo-Islamic',
        'Colonial',
        'Modernist',
        'Romanesque',
        'British Colonial',
        'Other',
      ],
    },
    yearBuilt: Number,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    images: [String],
    compositeScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    scoreHistory: [
      {
        date: Date,
        score: Number,
        inspector: mongoose.Schema.Types.ObjectId,
      },
    ],
    status: {
      type: String,
      enum: ['critical', 'poor', 'fair', 'good', 'excellent'],
      default: 'fair',
    },
    lastInspected: Date,
    nextScheduledInspection: Date,
    alertsCount: {
      type: Number,
      default: 0,
    },
    tasksCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Building', buildingSchema);
