const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: 'Too many auth requests from this IP, please try again after 15 minutes'
});

router.post('/register', 
  authLimiter,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  validate,
  registerUser
);

router.post('/login',
  authLimiter,
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  validate,
  loginUser
);

router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
