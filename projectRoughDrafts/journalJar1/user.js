// Require necessary modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  journal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal'
  }
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Compare password with hashed password in database
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export user model
module.exports = mongoose.model('User', userSchema);