require('dotenv').config();
const connectDB = require('../config/db');

const User = require('../models/User');
const DailyEntry = require('../models/DailyEntry');
const RealityCheck = require('../models/RealityCheck');
const Verification = require('../models/Verification');
const AwarenessTrace = require('../models/AwarenessTrace');
const Theme = require('../models/Theme');

async function createIndexes() {
  await connectDB();

  const models = [User, DailyEntry, RealityCheck, Verification, AwarenessTrace, Theme];

  for (const model of models) {
    await model.syncIndexes();
    console.log(`✅ indexes synced: ${model.modelName}`);
  }

  await User.db.close();
  console.log('🎉 all indexes created');
}

createIndexes().catch((error) => {
  console.error(error);
  process.exit(1);
});
