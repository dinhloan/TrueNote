const AwarenessTrace = require('../models/AwarenessTrace');
const Theme = require('../models/Theme');

async function listAwarenessTraces(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const page = Math.max(Number(req.query.page || 1), 1);
    const themeSlug = req.query.themeSlug;

    const filter = { userId: req.user._id };
    if (themeSlug) filter.themeSlugs = themeSlug;

    const [items, total] = await Promise.all([
      AwarenessTrace.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      AwarenessTrace.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total });
  } catch (error) {
    next(error);
  }
}

async function getAwarenessTrace(req, res, next) {
  try {
    const trace = await AwarenessTrace.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trace) return res.status(404).json({ message: 'Awareness trace not found' });
    res.json({ trace });
  } catch (error) {
    next(error);
  }
}

async function getAwarenessMap(req, res, next) {
  try {
    const topThemes = await Theme.find({ userId: req.user._id })
      .sort({ traceCount: -1, lastSeenAt: -1 })
      .limit(20);

    const recentTraces = await AwarenessTrace.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('awarenessStatement reminderStatement themes themeSlugs createdAt certaintyLevel');

    res.json({ topThemes, recentTraces });
  } catch (error) {
    next(error);
  }
}

async function listThemes(req, res, next) {
  try {
    const themes = await Theme.find({ userId: req.user._id }).sort({ traceCount: -1, lastSeenAt: -1 });
    res.json({ themes });
  } catch (error) {
    next(error);
  }
}

async function getThemeDetail(req, res, next) {
  try {
    const theme = await Theme.findOne({ _id: req.params.themeId, userId: req.user._id });
    if (!theme) return res.status(404).json({ message: 'Theme not found' });

    const traces = await AwarenessTrace.find({ userId: req.user._id, themeSlugs: theme.slug })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ theme, traces });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAwarenessTraces,
  getAwarenessTrace,
  getAwarenessMap,
  listThemes,
  getThemeDetail
};
