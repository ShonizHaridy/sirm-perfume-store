const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  addresses: [
    {
      title: {
        type: String,
        default: 'Default Address'
      },
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// // Method to compare passwords
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   console.log('Comparing password:', candidatePassword, 'with hashed password:', this.password);
//   return await bcrypt.compare(candidatePassword, this.password);
// };

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const storedHash = this.password;
    console.log('Stored hash:', storedHash);

    // Extract salt from stored hash
    const parts = storedHash.split('$');
    if (parts.length < 4) {
      throw new Error('Invalid stored hash format');
    }
    const saltFromStored = parts[3].substring(0, 22);
    const fullSalt = `\$${parts[1]}\$${parts[2]}\$${saltFromStored}`;

    // Hash the candidate password with the extracted salt
    const candidateHash = await bcrypt.hash(candidatePassword, fullSalt);
    console.log('Candidate hash (using stored salt):', candidateHash);

    // Compare the candidate password with stored hash
// In your comparePassword method
const isMatch = await bcrypt.compare(candidatePassword, storedHash);
console.log('Do they match?', isMatch); // Should be true  
return isMatch;
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw err;
  }
};

module.exports = mongoose.model('User', userSchema);