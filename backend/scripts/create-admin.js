const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const adminData = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'Admin@123', // Plain password - will be hashed by model
  role: 'admin',
  phone: '+123456789'
};

async function createAdmin() {
  try {
    // Delete existing admin if any (to start fresh)
    await User.deleteOne({ email: adminData.email });
    console.log('Cleaned up any existing admin user');
    
    // Create new admin user (let the model handle hashing)
    const admin = new User(adminData);
    await admin.save();
    
    console.log('Admin user created successfully!');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();