const mongoose = require('mongoose');
const { Schema } = mongoose;

const factSchema = new Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const realityCheckSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    dailyEntryId: {
      type: Schema.Types.ObjectId,
      ref: 'DailyEntry',
      required: true,
      index: true
    },
    facts: {
      type: [factSchema],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 30;
        },
        message: 'facts cannot exceed 30 items'
      }
    }
  },
  { timestamps: true }
);

realityCheckSchema.index({ userId: 1, dailyEntryId: 1 }, { unique: true });

module.exports = mongoose.model('RealityCheck', realityCheckSchema);
