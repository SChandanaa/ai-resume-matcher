const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const { extractText } = require("../utils/textExtractor");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

router.post("/upload", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;

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

// Get all resumes for the logged-in user
router.get("/list", verifyToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Match Resume with Job Description (Phase 1: Simple Keyword Matching)
router.post("/match", verifyToken, async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Intelligent Matching using Gemini AI
    // Updated to gemini-2.5-flash as 1.5 is deprecated in this timeline
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as an expert Applicant Tracking System (ATS). Compare the following Resume Text against the Job Description.
      
      Resume Text:
      "${resume.textContent}"
      
      Job Description:
      "${jobDescription}"
      
      Return a JSON response ONLY with the following structure (no markdown):
      {
        "score": number (0-100),
        "matchedKeywords": ["list of key matched skills found in both"],
        "missingKeywords": ["critical skills from JD missing in resume"],
        "feedback": "A short, constructive qualitative feedback summary (max 2 sentences)."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const analysis = JSON.parse(text);

    // Ensure matchedKeywords is a number if frontend expects number, OR update frontend to handle array.
    // Dashboard currently expects: matchedKeywords: number, missingKeywords: string[]
    // Let's adapt the AI response to match our Frontend interface or update Frontend.
    // Current Frontend Interface:
    // matchedKeywords: number
    // totalKeywords: number
    // missingKeywords: string[]
    
    // We will calculate counts from AI response
    const matchedCount = analysis.matchedKeywords ? analysis.matchedKeywords.length : 0;
    const missingCount = analysis.missingKeywords ? analysis.missingKeywords.length : 0;
    const totalCount = matchedCount + missingCount;

    res.json({
      score: analysis.score,
      totalKeywords: totalCount,
      matchedKeywords: matchedCount, 
      missingKeywords: analysis.missingKeywords || [],
      feedback: analysis.feedback
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
