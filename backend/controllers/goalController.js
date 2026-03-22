const Goal = require('../models/Goal');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, milestones } = req.body;

    const goal = new Goal({
      title,
      description,
      startDate,
      endDate,
      milestones: milestones || [],
      userId: req.user._id
    });

    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, milestones, progress, status } = req.body;

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });

    if (goal) {
      goal.title = title || goal.title;
      goal.description = description !== undefined ? description : goal.description;
      goal.startDate = startDate || goal.startDate;
      goal.endDate = endDate || goal.endDate;
      goal.milestones = milestones || goal.milestones;
      
      if (progress !== undefined) goal.progress = progress;
      if (status !== undefined) goal.status = status;

      const updatedGoal = await goal.save();
      res.json(updatedGoal);
    } else {
      res.status(404);
      throw new Error('Goal not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (goal) {
      res.json({ message: 'Goal removed' });
    } else {
      res.status(404);
      throw new Error('Goal not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
};
