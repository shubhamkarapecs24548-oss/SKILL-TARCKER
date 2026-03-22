const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  hoursSpent: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  newProgress: { type: Number, required: true, min: 0, max: 100 }
}, {
  timestamps: true
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
