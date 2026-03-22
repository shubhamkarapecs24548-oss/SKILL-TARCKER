const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    await User.deleteMany({ email: 'admin@tracker.com' }); // clear previous
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@tracker.com',
      password: 'password123',
      role: 'Admin'
    });
    // The pre-save hook will hash the password

    await adminUser.save();
    console.log('Admin user seeded!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedAdmin();
