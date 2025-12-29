// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    googleId: { type: String },
    githubId: { type: String },
    role: { type: String, enum: ["candidate", "recruiter"], default: "candidate" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
