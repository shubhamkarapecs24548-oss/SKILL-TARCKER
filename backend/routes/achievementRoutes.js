const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const {
  getAchievements,
  awardAchievement
} = require('../controllers/achievementController');

const router = express.Router();

router.route('/')
  .get(protect, getAchievements)
  .post(protect, awardAchievement);

module.exports = router;
