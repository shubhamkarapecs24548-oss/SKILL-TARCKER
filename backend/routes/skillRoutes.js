const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');

const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getCategories
} = require('../controllers/skillController');

const router = express.Router();

router.get('/categories', protect, getCategories);

router.route('/')
  .get(protect, getSkills)
  .post(
    protect,
    [
      body('name', 'Name is required').not().isEmpty()
    ],
    validate,
    createSkill
  );

router.route('/:id')
  .get(protect, getSkillById)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
