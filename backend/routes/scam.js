const express = require("express");
const router = express.Router();
const ScamReport = require("../models/ScamReport");
const RiskScore = require("../models/RiskScore");
const { calculateRisk } = require("../utils/riskEngine");

// @route   POST /api/scam/verify
// @desc    Analyze a job listing for potential scam risk
// @access  Public
router.post("/verify", async (req, res) => {
  try {
    const { jobUrl, companyName, recruiterEmail, description } = req.body;

    // 1. Calculate algorithmic risk
    const riskAnalysis = calculateRisk({ jobUrl, companyName, recruiterEmail, description });

    // 2. Check for community reports (Simple exact match on company name for now)
    // In production, use fuzzy search or domain matching
    const existingReports = await ScamReport.find({ companyName: new RegExp(`^${companyName}$`, 'i') });
    
    // Adjust score based on reports
    if (existingReports.length > 0) {
      riskAnalysis.trustScore -= (existingReports.length * 10);
      riskAnalysis.riskFactors.push({
        riskType: "community_reports",
        severity: "high",
        description: `Found ${existingReports.length} user report(s) referencing this company.`
      });
    }

    // Ensure score is within bounds
    riskAnalysis.trustScore = Math.max(0, riskAnalysis.trustScore);

    res.json({
      ...riskAnalysis,
      reportCount: existingReports.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error checking risk score" });
  }
});

// @route   POST /api/scam/report
// @desc    Submit a scam report
// @access  Public (or Protected later)
router.post("/report", async (req, res) => {
  try {
    const { companyName, jobUrl, recruiterEmail, description, scamType } = req.body;

    // Validate simple required fields
    if (!companyName || !description) {
      return res.status(400).json({ error: "Company Name and Description are required" });
    }

    const newReport = new ScamReport({
      companyName,
      jobUrl,
      recruiterEmail,
      description,
      scamType
    });

    await newReport.save();

    // Optionally update aggregate RiskScore collection here

    res.status(201).json({ message: "Report submitted successfully", report: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error submitting report" });
  }
});

// @route   GET /api/scam/reports
// @desc    Get latest scam reports
// @access  Public
router.get("/reports", async (req, res) => {
  try {
    const reports = await ScamReport.find().sort({ createdAt: -1 }).limit(20);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching reports" });
  }
});

module.exports = router;
