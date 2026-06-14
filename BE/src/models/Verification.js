const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationSchema = new Schema(
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
    realityCheckId: {
      type: Schema.Types.ObjectId,
      ref: 'RealityCheck'
    },

    beliefBeingChecked: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    beliefLevelBefore: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    supportingBasis: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 20;
        },
        message: 'supportingBasis cannot exceed 20 items'
      }
    },
    isBasisEnough: {
      type: String,
      enum: ['enough', 'not_enough', 'uncertain'],
      required: true
    },
    alternativePossibilities: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 20;
        },
        message: 'alternativePossibilities cannot exceed 20 items'
      }
    },
    reasoningConclusion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    beliefLevelAfter: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

verificationSchema.index({ userId: 1, dailyEntryId: 1, createdAt: -1 });
verificationSchema.index({ userId: 1, beliefBeingChecked: 'text', reasoningConclusion: 'text' });

module.exports = mongoose.model('Verification', verificationSchema);
