const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const { extractText } = require("../utils/textExtractor");
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename: user-id-timestamp-originalName
    // We might not have user id in req.body immediately if not using auth middleware yet, 
    // but assuming we will use auth middleware. 
    // For now, let's use timestamp-originalName
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Resumes only! (pdf, doc, docx)");
    }
  }
});

// Upload Resume Route
// Note: We'll add auth middleware later. For now, we'll assume the client sends user ID in body or we test without it first.
// Ideally, we should use the auth middleware created in auth.js if it exposes one, but auth.js mostly just had routes. 
// We might need to abstract the 'verifyToken' middleware. 
// For this step, I'll just create the route and simple handling.

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Temporary: If no user ID is provided (since we haven't integrated full auth middleware on routes yet),
    // we might fail validation if we try to save without a user.
    // For testing purposes, let's assume the user ID is passed in the body or we mock it.
    // However, the Schema requires 'user'.
    // I will check if I can make it optional for initial testing or if I should implement a simple middleware here.
    
    // Let's assume the frontend sends 'userId' in the body for now alongside the file.
    const { userId } = req.body;

    // Extract text from the uploaded file
    const extractedText = await extractText(req.file.path, req.file.mimetype);

    const newResume = new Resume({
      user: userId, // This must be a valid ObjectId string
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      textContent: extractedText
    });

    await newResume.save();

    res.status(201).json({ 
      message: "Resume uploaded successfully", 
      resume: newResume 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get all resumes for a user
router.get("/list/:userId", async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.params.userId }).sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Match Resume with Job Description (Phase 1: Simple Keyword Matching)
router.post("/match", async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Basic Keyword Matching Logic
    const resumeText = (resume.textContent || "").toLowerCase();
    const jdText = (jobDescription || "").toLowerCase();
    
    // Extract keywords from JD (removing common stop words)
    const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "is", "are", "was", "were", "be", "been", "of", "from", "as", "by"];
    const jdKeywords = jdText
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    // Calculate Score
    const uniqueKeywords = [...new Set(jdKeywords)];
    let matchCount = 0;
    const missingKeywords = [];

    uniqueKeywords.forEach(keyword => {
      if (resumeText.includes(keyword)) {
        matchCount++;
      } else {
        missingKeywords.push(keyword);
      }
    });

    const score = Math.round((matchCount / uniqueKeywords.length) * 100) || 0;

    res.json({
      score,
      totalKeywords: uniqueKeywords.length,
      matchedKeywords: matchCount,
      missingKeywords: missingKeywords.slice(0, 10), // Limit to top 10 missing
      feedback: score > 70 ? "Great Match!" : score > 40 ? "Good Potential" : "Needs Improvement"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
