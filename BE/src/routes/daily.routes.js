const express = require('express');
const requireAuth = require('../middleware/auth');
const {
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
} = require('../controllers/daily.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/today', getTodayEntry);
router.get('/:date', getEntryByDate);
router.post('/', createOrUpdateDailyEntry);
router.put('/:id', updateDailyEntry);

router.post('/:id/reality', createOrUpdateReality);
router.get('/:id/reality', getReality);
router.put('/reality/:id', updateReality);

router.post('/:id/verification', createVerification);
router.get('/:id/verification', getVerifications);
router.put('/verification/:id', updateVerification);

router.post('/:id/awareness-trace', createAwarenessTrace);

module.exports = router;
