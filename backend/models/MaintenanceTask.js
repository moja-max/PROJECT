import mongoose from 'mongoose';

const maintenanceTaskSchema = new mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'on-hold'],
      default: 'pending',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: Date,
    completedDate: Date,
    estimatedCost: Number,
    actualCost: Number,
    notes: String,
    attachments: [String],
    relatedInspection: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceTask', maintenanceTaskSchema);
