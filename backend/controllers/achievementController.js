const Achievement = require('../models/Achievement');
const User = require('../models/User');

// @desc    Get user achievements
// @route   GET /api/achievements
// @access  Private
const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ userId: req.user._id }).sort({ earnedAt: -1 });

    const user = await User.findById(req.user._id);

    res.json({
      achievements,
      streak: user.streak,
      longestStreak: user.longestStreak
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Award achievement manually (if needed)
// @route   POST /api/achievements
// @access  Private
const awardAchievement = async (req, res, next) => {
  try {
    const { badgeId } = req.body;

    // Check if already earned
    const existing = await Achievement.findOne({ userId: req.user._id, badgeId });
    if(existing) {
        return res.status(400).json({ message: 'Achievement already earned' });
    }

    const achievement = await Achievement.create({
      userId: req.user._id,
      badgeId
    });

    res.status(201).json(achievement);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAchievements,
  awardAchievement
};
