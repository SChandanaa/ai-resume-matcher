// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render/Heroku) for proper HTTPS support
app.use(cors({
  origin: '*', // Allow all origins for now to troubleshoot
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const passport = require("passport");
require("./config/passport")();
app.use(passport.initialize());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/scam", require("./routes/scam"));
app.use("/api/jobs", require("./routes/jobs"));

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
