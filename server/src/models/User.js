import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ['learner', 'instructor'],
    // default: 'learner',
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;