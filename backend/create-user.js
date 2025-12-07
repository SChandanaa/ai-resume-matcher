const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Simple User Schema definition since we might not want to require the full model file if it has other deps
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String
});
const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    try {
      const email = 'demo@example.com';
      let user = await User.findOne({ email });
      if (user) {
        console.log('User already exists:', user._id);
      } else {
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = await User.create({
          name: 'Demo User',
          email,
          password: hashedPassword,
          role: 'jobseeker'
        });
        console.log('Created new user:', user._id);
      }
    } catch (err) {
      console.error(err);
    }
    process.exit(0);
  });
