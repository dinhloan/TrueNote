const DailyEntry = require('../models/DailyEntry');
const RealityCheck = require('../models/RealityCheck');
const Verification = require('../models/Verification');
const AwarenessTrace = require('../models/AwarenessTrace');
const Theme = require('../models/Theme');
const { normalizeThemes } = require('../utils/normalizeTheme');

function countWords(text = '') {
  const cleaned = String(text).trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}

function mapFacts(facts = []) {
  return facts.map((fact, index) => {
    if (typeof fact === 'string') return { text: fact, order: index };
    return { text: fact.text, order: fact.order ?? index };
  });
}

async function getTodayEntry(req, res, next) {
  try {
    const localDate = req.query.date || new Date().toISOString().slice(0, 10);
    const entry = await DailyEntry.findOne({ userId: req.user._id, localDate });
    res.json({ entry });
  } catch (error) {
    next(error);
  }
}

async function getEntryByDate(req, res, next) {
  try {
    const entry = await DailyEntry.findOne({
      userId: req.user._id,
      localDate: req.params.date
    });

    if (!entry) return res.status(404).json({ message: 'Daily entry not found' });
    res.json({ entry });
  } catch (error) {
    next(error);
  }
}

async function createOrUpdateDailyEntry(req, res, next) {
  try {
    const { localDate, rawContent = '', status = 'writing' } = req.body;

    if (!localDate) {
      return res.status(400).json({ message: 'localDate is required, format YYYY-MM-DD' });
    }

    const entry = await DailyEntry.findOneAndUpdate(
      { userId: req.user._id, localDate },
      {
        $set: {
          rawContent,
          status,
          wordCount: countWords(rawContent),
          lastAutosavedAt: new Date()
        }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
}

async function updateDailyEntry(req, res, next) {
  try {
    const { rawContent, status } = req.body;
    const update = {};

    if (rawContent !== undefined) {
      update.rawContent = rawContent;
      update.wordCount = countWords(rawContent);
      update.lastAutosavedAt = new Date();
    }
    if (status !== undefined) update.status = status;

    const entry = await DailyEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!entry) return res.status(404).json({ message: 'Daily entry not found' });
    res.json({ entry });
  } catch (error) {
    next(error);
  }
}

async function createOrUpdateReality(req, res, next) {
  try {
    const entry = await DailyEntry.findOne({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Daily entry not found' });

    const facts = mapFacts(req.body.facts || []);

    const reality = await RealityCheck.findOneAndUpdate(
      { userId: req.user._id, dailyEntryId: entry._id },
      { $set: { facts } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    entry.hasReality = true;
    entry.status = 'checking';
    await entry.save();

    res.status(201).json({ reality });
  } catch (error) {
    next(error);
  }
}

async function getReality(req, res, next) {
  try {
    const reality = await RealityCheck.findOne({
      userId: req.user._id,
      dailyEntryId: req.params.id
    });

    if (!reality) return res.status(404).json({ message: 'Reality check not found' });
    res.json({ reality });
  } catch (error) {
    next(error);
  }
}

async function updateReality(req, res, next) {
  try {
    const reality = await RealityCheck.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { facts: mapFacts(req.body.facts || []) } },
      { new: true, runValidators: true }
    );

    if (!reality) return res.status(404).json({ message: 'Reality check not found' });
    res.json({ reality });
  } catch (error) {
    next(error);
  }
}

async function createVerification(req, res, next) {
  try {
    const entry = await DailyEntry.findOne({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Daily entry not found' });

    const reality = await RealityCheck.findOne({ userId: req.user._id, dailyEntryId: entry._id });

    const verification = await Verification.create({
      userId: req.user._id,
      dailyEntryId: entry._id,
      realityCheckId: reality?._id,
      beliefBeingChecked: req.body.beliefBeingChecked,
      beliefLevelBefore: req.body.beliefLevelBefore,
      supportingBasis: req.body.supportingBasis || [],
      isBasisEnough: req.body.isBasisEnough,
      alternativePossibilities: req.body.alternativePossibilities || [],
      reasoningConclusion: req.body.reasoningConclusion,
      beliefLevelAfter: req.body.beliefLevelAfter
    });

    entry.hasVerification = true;
    entry.status = 'checking';
    await entry.save();

    res.status(201).json({ verification });
  } catch (error) {
    next(error);
  }
}

async function getVerifications(req, res, next) {
  try {
    const verifications = await Verification.find({
      userId: req.user._id,
      dailyEntryId: req.params.id
    }).sort({ createdAt: -1 });

    res.json({ verifications });
  } catch (error) {
    next(error);
  }
}

async function updateVerification(req, res, next) {
  try {
    const allowed = [
      'beliefBeingChecked',
      'beliefLevelBefore',
      'supportingBasis',
      'isBasisEnough',
      'alternativePossibilities',
      'reasoningConclusion',
      'beliefLevelAfter'
    ];

    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const verification = await Verification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!verification) return res.status(404).json({ message: 'Verification not found' });
    res.json({ verification });
  } catch (error) {
    next(error);
  }
}

async function createAwarenessTrace(req, res, next) {
  try {
    const entry = await DailyEntry.findOne({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Daily entry not found' });

    const verification = await Verification.findOne({
      _id: req.body.verificationId,
      userId: req.user._id,
      dailyEntryId: entry._id
    });
    if (!verification) return res.status(404).json({ message: 'Verification not found' });

    const reality = await RealityCheck.findOne({ userId: req.user._id, dailyEntryId: entry._id });
    const normalizedThemes = normalizeThemes(req.body.themes || []);
    const themeNames = normalizedThemes.map((theme) => theme.name);
    const themeSlugs = normalizedThemes.map((theme) => theme.slug);

    const trace = await AwarenessTrace.create({
      userId: req.user._id,
      dailyEntryId: entry._id,
      verificationId: verification._id,
      awarenessStatement: req.body.awarenessStatement,
      reminderStatement: req.body.reminderStatement,
      certaintyLevel: req.body.certaintyLevel,
      themes: themeNames,
      themeSlugs,
      snapshot: {
        rawContent: entry.rawContent,
        realityFacts: (reality?.facts || []).map((fact) => fact.text),
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
    });

    await Promise.all(
      normalizedThemes.map((theme) =>
        Theme.findOneAndUpdate(
          { userId: req.user._id, slug: theme.slug },
          {
            $setOnInsert: { name: theme.name, slug: theme.slug },
            $inc: { traceCount: 1 },
            $set: { lastSeenAt: new Date() }
          },
          { upsert: true, new: true }
        )
      )
    );

    entry.hasTrace = true;
    entry.status = 'completed';
    await entry.save();

    res.status(201).json({ trace });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTodayEntry,
  getEntryByDate,
  createOrUpdateDailyEntry,
  updateDailyEntry,
  createOrUpdateReality,
  getReality,
  updateReality,
  createVerification,
  getVerifications,
  updateVerification,
  createAwarenessTrace
};
