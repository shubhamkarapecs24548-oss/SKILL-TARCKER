const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');

const {
  addProgress,
  getSkillProgress
} = require('../controllers/progressController');

const router = express.Router();

router.route('/')
  .post(
    protect,
    [
      body('skillId', 'Skill ID is required').not().isEmpty(),
      body('newProgress', 'New Progress must be a number between 0 and 100').isNumeric().custom(val => val >= 0 && val <= 100)
    ],
    validate,
    addProgress
  );

router.route('/skill/:skillId')
  .get(protect, getSkillProgress);

module.exports = router;
