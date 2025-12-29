// backend/utils/riskEngine.js

const FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "protonmail.com"];

/**
 * Analyze job details and return a risk assessment.
 * @param {Object} data - { jobUrl, companyName, recruiterEmail, salary, description }
 * @returns {Object} - { trustScore: number, riskFactors: Array<{riskType, severity, description}> }
 */
function calculateRisk(data) {
  const { jobUrl, companyName, recruiterEmail, salary, description } = data;
  
  let trustScore = 100; // Start with perfect trust
  const riskFactors = [];

  // Check 1: Recruiter Email Domain
  if (recruiterEmail) {
    const emailDomain = recruiterEmail.split('@')[1];
    if (emailDomain && FREE_EMAIL_DOMAINS.includes(emailDomain.toLowerCase())) {
      trustScore -= 40;
      riskFactors.push({
        riskType: "free_email_provider",
        severity: "high",
        description: `Recruiter is using a free email provider (${emailDomain}) instead of a corporate domain.`
      });
    }
  }

  // Check 2: No Company Website / URL
  if (!jobUrl || jobUrl.trim() === "") {
    // If no URL provided, it's harder to verify.
    trustScore -= 10;
    riskFactors.push({
      riskType: "missing_url",
      severity: "low",
      description: "No specific job link provided for verification."
    });
  }

  // Check 3: WhatsApp mentions (in description or contact)
  // This depends on if 'description' contains keywords.
  if (description) {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("whatsapp") || lowerDesc.includes("telegram")) {
        // Context matters, but "Contact on WhatsApp" is often a red flag for scams.
        trustScore -= 20;
        riskFactors.push({
            riskType: "chat_app_contact",
            severity: "medium",
            description: "Job posting mentions WhatsApp/Telegram, which is common in scams."
        });
    }
    
    if (lowerDesc.includes("registration fee") || lowerDesc.includes("pay") || lowerDesc.includes("security deposit")) {
        trustScore -= 50;
        riskFactors.push({
            riskType: "payment_demands",
            severity: "critical",
            description: "Job mentions payment, fees, or deposits. Legitimate jobs NEVER ask for money."
        });
    }
  }

  // Cap score
  return {
    trustScore: Math.max(0, Math.min(100, trustScore)),
    riskFactors
  };
}

module.exports = { calculateRisk };
