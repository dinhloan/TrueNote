const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationSnapshotSchema = new Schema(
  {
    beliefBeingChecked: String,
    beliefLevelBefore: Number,
    supportingBasis: [String],
    isBasisEnough: String,
    alternativePossibilities: [String],
    reasoningConclusion: String,
    beliefLevelAfter: Number
  },
  { _id: false }
);

const awarenessTraceSchema = new Schema(
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
    verificationId: {
      type: Schema.Types.ObjectId,
      ref: 'Verification',
      required: true,
      index: true
    },

    awarenessStatement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    reminderStatement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    certaintyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    themes: {
      type: [String],
      default: []
    },
    themeSlugs: {
      type: [String],
      default: [],
      index: true
    },

    // Snapshot keeps the trace stable even if user edits the original entry later.
    snapshot: {
      rawContent: { type: String, default: '' },
      realityFacts: { type: [String], default: [] },
      verification: verificationSnapshotSchema
    }
  },
  { timestamps: true }
);

awarenessTraceSchema.index({ userId: 1, verificationId: 1 }, { unique: true });
awarenessTraceSchema.index({ userId: 1, createdAt: -1 });
awarenessTraceSchema.index({ userId: 1, themeSlugs: 1, createdAt: -1 });
awarenessTraceSchema.index({ awarenessStatement: 'text', reminderStatement: 'text', themes: 'text' });

module.exports = mongoose.model('AwarenessTrace', awarenessTraceSchema);
