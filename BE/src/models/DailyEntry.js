const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyEntrySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Store user's local calendar date as YYYY-MM-DD for stable daily journal lookup.
    localDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/
    },

    rawContent: {
      type: String,
      default: '',
      maxlength: 50000
    },

    status: {
      type: String,
      enum: ['writing', 'raw', 'checking', 'completed'],
      default: 'writing',
      index: true
    },

    hasReality: { type: Boolean, default: false },
    hasVerification: { type: Boolean, default: false },
    hasTrace: { type: Boolean, default: false },

    wordCount: { type: Number, default: 0 },
    lastAutosavedAt: Date
  },
  { timestamps: true }
);

dailyEntrySchema.index({ userId: 1, localDate: 1 }, { unique: true });
dailyEntrySchema.index({ userId: 1, status: 1, updatedAt: -1 });
dailyEntrySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('DailyEntry', dailyEntrySchema);
