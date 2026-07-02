import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'warning', 'info'],
      required: true,
    },
    type: {
      type: String,
      enum: ['condition_score_drop', 'threshold_breach', 'overdue_inspection', 'maintenance_overdue'],
      required: true,
    },
    score: Number,
    message: {
      type: String,
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedDate: Date,
    resolvedBy: mongoose.Schema.Types.ObjectId,
    resolutionNotes: String,
    triggeredAt: {
      type: Date,
      default: Date.now,
    },
    notifiedUsers: [
      {
        user: mongoose.Schema.Types.ObjectId,
        method: { type: String, enum: ['email', 'in-app', 'sms'] },
        sentAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);
