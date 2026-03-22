const Progress = require('../models/Progress');
const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Add daily progress
// @route   POST /api/progress
// @access  Private
const addProgress = async (req, res, next) => {
  try {
    const { skillId, hoursSpent, notes, newProgress } = req.body;

    const skill = await Skill.findOne({ _id: skillId, userId: req.user._id });
    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    const progress = await Progress.create({
      skillId,
      userId: req.user._id,
      hoursSpent,
      notes,
      newProgress
    });

    skill.progress = newProgress;
    if (newProgress === 100) {
      skill.status = 'Completed';
    } else if (skill.status === 'Not Started' && newProgress > 0) {
      skill.status = 'In Progress';
    }
    await skill.save();

    // Update streak
    const user = await User.findById(req.user._id);
    const today = new Date().setHours(0,0,0,0);
    const lastLogin = user.lastLogin ? new Date(user.lastLogin).setHours(0,0,0,0) : 0;
    
    if (today > lastLogin) {
      user.streak += 1;
      if (user.streak > user.longestStreak) {
        user.longestStreak = user.streak;
      }
    } else if (today - lastLogin > 86400000) {
      user.streak = 1; // reset streak if missed a day
    }
    user.lastLogin = Date.now();
    await user.save();

    res.status(201).json(progress);
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress history for a skill
// @route   GET /api/progress/skill/:skillId
// @access  Private
const getSkillProgress = async (req, res, next) => {
  try {
    const progressHistory = await Progress.find({ skillId: req.params.skillId, userId: req.user._id }).sort({ date: -1 });
    res.json(progressHistory);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProgress,
  getSkillProgress
};
