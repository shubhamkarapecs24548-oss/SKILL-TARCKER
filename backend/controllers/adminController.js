const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await Skill.deleteMany({ userId: user._id }); // cleanup
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics dashboard data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const completedSkills = await Skill.countDocuments({ status: 'Completed' });

    // Aggregate skills by category
    const skillsByCategory = await Skill.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalSkills,
      completedSkills,
      skillsByCategory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all skills across all users
// @route   GET /api/admin/skills
// @access  Private/Admin
const getAllSkills = async (req, res, next) => {
    try {
        const skills = await Skill.find({}).populate('userId', 'name email');
        res.json(skills);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
  getAllSkills
};
