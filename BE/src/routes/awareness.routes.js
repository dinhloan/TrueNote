const express = require('express');
const requireAuth = require('../middleware/auth');
const {
  listAwarenessTraces,
  getAwarenessTrace,
  getAwarenessMap,
  listThemes,
  getThemeDetail
} = require('../controllers/awareness.controller');
const { updateReality, updateVerification } = require('../controllers/daily.controller');

const router = express.Router();

router.use(requireAuth);

// Canonical update routes matching the product README API spec.
router.put('/reality/:id', updateReality);
router.put('/verification/:id', updateVerification);

router.get('/awareness-traces', listAwarenessTraces);
router.get('/awareness-traces/:id', getAwarenessTrace);
router.get('/awareness-map', getAwarenessMap);
router.get('/themes', listThemes);
router.get('/themes/:themeId', getThemeDetail);

module.exports = router;
