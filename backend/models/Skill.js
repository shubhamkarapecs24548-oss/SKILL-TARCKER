const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, default: 'Other' },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  notes: { type: String, default: '' },
  resources: [{ type: String }],
  deadline: { type: Date },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Soft delete middleware
skillSchema.pre(/^find/, function() {
  this.where({ isDeleted: false });
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
