const Skill = require('../models/Skill');

// @desc    Get all skills for a user (with filtering, sorting, searching)
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res, next) => {
  try {
    const { search, category, level, status, sortBy } = req.query;

    let query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $in: category.split(',') };
    }
    
    if (level) query.level = level;
    if (status) query.status = status;

    let sortOptions = { createdAt: -1 };
    if (sortBy) {
      if (sortBy === 'name') sortOptions = { name: 1 };
      else if (sortBy === 'progress') sortOptions = { progress: -1 };
      else if (sortBy === 'deadline') sortOptions = { deadline: 1 };
    }

    const skills = await Skill.find(query).sort(sortOptions);
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Private
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });

    if (skill) {
      res.json(skill);
    } else {
      res.status(404);
      throw new Error('Skill not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const { name, category, level, notes, resources, deadline, status } = req.body;

    const skill = new Skill({
      name,
      category,
      level,
      notes,
      resources: resources || [],
      deadline,
      status,
      userId: req.user._id
    });

    const createdSkill = await skill.save();
    
    // Check for beginner badge achievement logic can be called here or via an event

    res.status(201).json(createdSkill);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const { name, category, level, notes, resources, deadline, status, progress } = req.body;

    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });

    if (skill) {
      skill.name = name || skill.name;
      skill.category = category || skill.category;
      skill.level = level || skill.level;
      skill.notes = notes !== undefined ? notes : skill.notes;
      skill.resources = resources || skill.resources;
      skill.deadline = deadline || skill.deadline;
      skill.status = status || skill.status;
      if (progress !== undefined) {
        skill.progress = progress;
        if (progress === 100) skill.status = 'Completed';
      }

      const updatedSkill = await skill.save();
      res.json(updatedSkill);
    } else {
      res.status(404);
      throw new Error('Skill not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill (Soft delete)
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });

    if (skill) {
      skill.isDeleted = true;
      await skill.save();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404);
      throw new Error('Skill not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique user categories
// @route   GET /api/skills/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Skill.distinct('category', { userId: req.user._id, isDeleted: false });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getCategories
};
