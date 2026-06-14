require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const DailyEntry = require('../models/DailyEntry');
const RealityCheck = require('../models/RealityCheck');
const Verification = require('../models/Verification');
const AwarenessTrace = require('../models/AwarenessTrace');
const Theme = require('../models/Theme');
const { normalizeThemes } = require('../utils/normalizeTheme');

async function seed() {
  await connectDB();

  const email = 'demo@awareness.local';
  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { displayName: 'Demo User', email, passwordHash } },
    { upsert: true, new: true }
  );

  const entry = await DailyEntry.findOneAndUpdate(
    { userId: user._id, localDate: '2026-05-14' },
    {
      $set: {
        rawContent: 'Bạn đó không trả lời tin nhắn. Mình nghĩ chắc họ không còn quan tâm mình nữa.',
        status: 'completed',
        hasReality: true,
        hasVerification: true,
        hasTrace: true,
        wordCount: 16,
        lastAutosavedAt: new Date()
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const reality = await RealityCheck.findOneAndUpdate(
    { userId: user._id, dailyEntryId: entry._id },
    {
      $set: {
        facts: [
          { text: 'Họ chưa trả lời tin nhắn trong 5 tiếng', order: 0 },
          { text: 'Mình chưa hỏi lý do', order: 1 },
          { text: 'Hôm nay mình ngủ ít', order: 2 }
        ]
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const verification = await Verification.create({
    userId: user._id,
    dailyEntryId: entry._id,
    realityCheckId: reality._id,
    beliefBeingChecked: 'Họ không còn quan tâm mình',
    beliefLevelBefore: 4,
    supportingBasis: ['Họ chưa trả lời tin nhắn trong 5 tiếng'],
    isBasisEnough: 'not_enough',
    alternativePossibilities: ['Có thể họ đang bận', 'Có thể họ chưa thấy tin', 'Có thể họ đang mệt'],
    reasoningConclusion: 'Mình chưa đủ cơ sở để kết luận rằng họ không còn quan tâm mình',
    beliefLevelAfter: 2
  });

  const normalizedThemes = normalizeThemes(['sợ bị bỏ rơi', 'giá trị bản thân', 'diễn giải']);

  await AwarenessTrace.findOneAndUpdate(
    { userId: user._id, verificationId: verification._id },
    {
      $set: {
        dailyEntryId: entry._id,
        awarenessStatement: 'Mình nhận ra mình hay biến sự im lặng của người khác thành bằng chứng rằng mình không quan trọng.',
        reminderStatement: 'Sự im lặng không đồng nghĩa với sự từ chối.',
        certaintyLevel: 4,
        themes: normalizedThemes.map((theme) => theme.name),
        themeSlugs: normalizedThemes.map((theme) => theme.slug),
        snapshot: {
          rawContent: entry.rawContent,
          realityFacts: reality.facts.map((fact) => fact.text),
          verification: {
            beliefBeingChecked: verification.beliefBeingChecked,
            beliefLevelBefore: verification.beliefLevelBefore,
            supportingBasis: verification.supportingBasis,
            isBasisEnough: verification.isBasisEnough,
            alternativePossibilities: verification.alternativePossibilities,
            reasoningConclusion: verification.reasoningConclusion,
            beliefLevelAfter: verification.beliefLevelAfter
          }
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Promise.all(
    normalizedThemes.map((theme) =>
      Theme.findOneAndUpdate(
        { userId: user._id, slug: theme.slug },
        {
          $setOnInsert: { name: theme.name, slug: theme.slug },
          $inc: { traceCount: 1 },
          $set: { lastSeenAt: new Date() }
        },
        { upsert: true, new: true }
      )
    )
  );

  console.log('🎉 seed completed');
  console.log('Demo login:', { email, password: 'password123' });
  await User.db.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
