const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

const extractText = async (filePath, mimeType) => {
  try {
    const buffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimeType === 'application/msword'
    ) {
      // Mammoth is best for .docx. For .doc (binary), it might struggle or need another tool like textract.
      // But typically .doc is less common now. We will try mammoth for docx.
      if (path.extname(filePath).toLowerCase() === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
      } else {
        return "Legacy .doc extraction not fully supported yet.";
      }
    }
    return "";
  } catch (error) {
    console.error("Text extraction failed:", error);
    return "";
  }
};

module.exports = { extractText };
