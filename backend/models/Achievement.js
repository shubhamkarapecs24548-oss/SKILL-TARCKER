const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { 
    type: String, 
    enum: ['Beginner', 'Consistent Learner', 'Pro', 'Category Master'],
    required: true
  },
  earnedAt: { type: Date, default: Date.now }
});

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;
