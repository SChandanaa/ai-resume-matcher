const mongoose = require("mongoose");

const riskScoreSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, index: true },
    jobUrl: { type: String }, // Optional, can be scoped to company or specific job
    domain: { type: String }, // Extracted domain from URL/Email
    
    // The calculated trust score (0-100, where 100 is safe, 0 is scam)
    trustScore: { type: Number, default: 50 },
    
    // Breakdown of risk factors
    riskFactors: [{
       riskType: String, // e.g., "free_email_provider", "bad_reviews"
       severity: String, // "high", "medium", "low"
       description: String
    }],

    reportCount: { type: Number, default: 0 },
    lastChecked: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskScore", riskScoreSchema);
