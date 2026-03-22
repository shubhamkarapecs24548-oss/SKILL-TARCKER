const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');

const {
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
  getAllSkills
} = require('../controllers/adminController');

const router = express.Router();

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id')
  .delete(protect, admin, deleteUser);

router.route('/users/:id/role')
  .put(protect, admin, updateUserRole);

router.route('/analytics')
  .get(protect, admin, getAnalytics);

router.route('/skills')
  .get(protect, admin, getAllSkills);

module.exports = router;
