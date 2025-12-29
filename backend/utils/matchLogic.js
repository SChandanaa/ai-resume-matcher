// backend/utils/matchLogic.js

/**
 * reliable-simple matching of two text blocks
 * Returns a score from 0-100
 */
function calculateMatchScore(resumeText, jobDescription) {
  if (!resumeText || !jobDescription) return 0;

  const getTokens = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '') // remove punctuation
      .split(/\s+/)
      .filter(w => w.length > 2); // ignore short words
  };

  const resumeTokens = new Set(getTokens(resumeText));
  const jobTokens = getTokens(jobDescription);

  if (jobTokens.length === 0) return 0;

  // Calculate generic overlap
  let matchCount = 0;
  jobTokens.forEach(token => {
    if (resumeTokens.has(token)) {
      matchCount++;
    }
  });

  // Calculate score relative to job description length (coverage)
  // We dampen it a bit so 100% isn't impossible but hard
  const rawScore = (matchCount / jobTokens.length) * 100;
  
  // Boost score slightly because exact match of EVERY word is rare/bad
  // We want "Keyword Coverage"
  const boostedScore = Math.min(100, rawScore * 1.5); 

  return Math.round(boostedScore);
}

module.exports = { calculateMatchScore };
