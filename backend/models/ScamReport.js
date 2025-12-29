const mongoose = require("mongoose");

const scamReportSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    jobUrl: { type: String },
    recruiterEmail: { type: String },
    description: { type: String }, // User's description of the scam
    scamType: {
      type: String,
      enum: ["money_demand", "fake_interview", "data_theft", "ghosting", "other"],
      default: "other"
    },
    evidenceFiles: [{ type: String }], // URLs to uploaded screenshots
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScamReport", scamReportSchema);
