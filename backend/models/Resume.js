const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  parsedContent: {
    type: Object, // To store structured data extracted from AI later
    default: {},
  },
  textContent: {
    type: String,
    default: "",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", ResumeSchema);
