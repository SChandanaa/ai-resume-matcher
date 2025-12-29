// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const passport = require("passport");

// ... (existing code)

// Middleware to verify token
const verifyToken = require("../middleware/authMiddleware");

// Get current user (Me)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google OAuth
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: "Google OAuth is not configured on the backend. Please check .env variables." });
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login?error=GoogleAuthFailed" }),
  (req, res) => {
    // Dynamic Frontend URL for mobile/LAN support
    // If backend is accessed via 192.168.x.x:5000, redirect to 192.168.x.x:5173
    const host = req.get('host'); // e.g., "localhost:5000" or "192.168.1.7:5000"
    const ip = host.split(':')[0];
    const frontendBase = process.env.FRONTEND_URL || `http://${ip}:5173`;

    // Generate token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.redirect(`${frontendBase}/login?token=${token}`);
  }
);

// GitHub OAuth
router.get("/github", (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(500).json({ error: "GitHub OAuth is not configured on the backend. Please check .env variables." });
  }
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login?error=GithubAuthFailed" }),
  (req, res) => {
    // Dynamic Frontend URL for mobile/LAN support
    const host = req.get('host');
    const ip = host.split(':')[0];
    const frontendBase = process.env.FRONTEND_URL || `http://${ip}:5173`;

    // Generate token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.redirect(`${frontendBase}/login?token=${token}`);
  }
);

module.exports = router;
