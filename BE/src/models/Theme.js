const mongoose = require('mongoose');
const { Schema } = mongoose;

const themeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    traceCount: {
      type: Number,
      default: 0,
      min: 0
    },
    relatedThemeSlugs: {
      type: [String],
      default: []
    },
    lastSeenAt: Date,

    // Denormalized hints for the Theme Detail screen. You can rebuild these later from traces.
    commonBeliefs: { type: [String], default: [] },
    commonBasis: { type: [String], default: [] },
    commonConclusions: { type: [String], default: [] }
  },
  { timestamps: true }
);

themeSchema.index({ userId: 1, slug: 1 }, { unique: true });
themeSchema.index({ userId: 1, traceCount: -1 });
themeSchema.index({ userId: 1, lastSeenAt: -1 });

module.exports = mongoose.model('Theme', themeSchema);
