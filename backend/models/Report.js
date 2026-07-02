import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['inspection', 'maintenance', 'portfolio', 'alert'],
      required: true,
    },
    building: mongoose.Schema.Types.ObjectId,
    buildings: [mongoose.Schema.Types.ObjectId],
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: Date,
    endDate: Date,
    content: String,
    fileUrl: String,
    format: {
      type: String,
      enum: ['pdf', 'csv', 'json'],
      default: 'pdf',
    },
    summary: {
      totalBuildings: Number,
      criticalCount: Number,
      poorCount: Number,
      fairCount: Number,
      goodCount: Number,
      excellentCount: Number,
      averageScore: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
