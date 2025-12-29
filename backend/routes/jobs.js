const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const { calculateMatchScore } = require("../utils/matchLogic");

const verifyToken = require("../middleware/authMiddleware");

// @route   POST /api/jobs/match
// @desc    Find the best resume for a given job description
// @access  Protected
router.post("/match", verifyToken, async (req, res) => {
  try {
    const { jobDescription, jobUrl } = req.body;
    const userId = req.user.id;

    if (!jobDescription) {
      return res.status(400).json({ error: "Job Description is required" });
    }

    // Fetch all resumes for this user
    const resumes = await Resume.find({ user: userId });

    if (resumes.length === 0) {
      return res.status(404).json({ message: "No resumes found for this user. Please upload one first." });
    }

    // Score each resume
    const scoredResumes = resumes.map(resume => {
      const score = calculateMatchScore(resume.textContent || "", jobDescription);
      return {
        _id: resume._id,
        fileName: resume.fileName,
        score: score,
        matchExplanation: `Matched ${score}% of keywords from the job description.`
      };
    });

    // Sort by highest score -- ensure we return a new array
    const sortedResumes = [...scoredResumes].sort((a, b) => b.score - a.score);

    res.json({
      bestMatch: sortedResumes[0],
      allMatches: sortedResumes,
      jobUrl
    });

  } catch (err) {
    console.error("Error in job matching:", err);
    res.status(500).json({ error: "Server error matching jobs" });
  }
});

module.exports = router;
