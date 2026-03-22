const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');

const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');

const router = express.Router();

router.route('/')
  .get(protect, getGoals)
  .post(
    protect,
    [
      body('title', 'Title is required').not().isEmpty()
    ],
    validate,
    createGoal
  );

router.route('/:id')
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

module.exports = router;
