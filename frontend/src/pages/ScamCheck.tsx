import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { verifyJob, reportScam, type ScanResult } from '../services/scamService';
import '../App.css';

const ScamCheck = () => {
      const [mode, setMode] = useState<'verify' | 'report'>('verify');
      const [formData, setFormData] = useState({
            companyName: '',
            jobUrl: '',
            recruiterEmail: '',
            description: ''
      });
      const [result, setResult] = useState<ScanResult | null>(null);
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState('');

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleVerify = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setResult(null);
            try {
                  const data = await verifyJob(formData);
                  setResult(data);
            } catch (err) {
                  console.error(err);
                  setMessage('Error verifying job. Please try again.');
            } finally {
                  setLoading(false);
            }
      };

      const handleReport = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            try {
                  await reportScam(formData);
                  setMessage('Report submitted successfully! Thank you for helping the community.');
                  setFormData({ companyName: '', jobUrl: '', recruiterEmail: '', description: '' });
            } catch (err) {
                  console.error(err);
                  setMessage('Error submitting report.');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="max-w-7xl mx-auto p-4 md:p-8 text-[var(--text)]">
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                  >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                              Job Safety & Verification
                        </h1>
                        <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto">
                              Verify job listings and report scams to protect the community.
                        </p>
                  </motion.div>

                  <div className="flex justify-center gap-4 mb-8">
                        <button
                              onClick={() => setMode('verify')}
                              className={`
                                    px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all
                                    ${mode === 'verify'
                                          ? 'bg-[var(--primary)] text-white border border-[var(--primary)]'
                                          : 'bg-transparent text-[var(--text)] border border-[var(--surface)] hover:bg-slate-50'
                                    }
                              `}
                        >
                              <Search size={18} /> Verify Term
                        </button>
                        <button
                              onClick={() => setMode('report')}
                              className={`
                                    px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all
                                    ${mode === 'report'
                                          ? 'bg-[var(--secondary)] text-white border border-[var(--secondary)]'
                                          : 'bg-transparent text-[var(--text)] border border-[var(--surface)] hover:bg-slate-50'
                                    }
                              `}
                        >
                              <Shield size={18} /> Report Scam
                        </button>
                  </div>

                  <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: mode === 'verify' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-[var(--glass-border)] shadow-sm max-w-2xl mx-auto"
                  >
                        <form onSubmit={mode === 'verify' ? handleVerify : handleReport} className="flex flex-col gap-6">

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                          <label className="font-medium">Company Name *</label>
                                          <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g. Acme Corp"
                                                className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full text-base focus:border-[var(--primary)] outline-none transition-colors"
                                          />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                          <label className="font-medium">Recruiter Email</label>
                                          <input
                                                type="email"
                                                name="recruiterEmail"
                                                value={formData.recruiterEmail}
                                                onChange={handleInputChange}
                                                placeholder="recruiter@example.com"
                                                className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full text-base focus:border-[var(--primary)] outline-none transition-colors"
                                          />
                                    </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                    <label className="font-medium">Job URL</label>
                                    <input
                                          type="url"
                                          name="jobUrl"
                                          value={formData.jobUrl}
                                          onChange={handleInputChange}
                                          placeholder="https://linkedin.com/jobs/..."
                                          className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full text-base focus:border-[var(--primary)] outline-none transition-colors"
                                    />
                              </div>

                              <div className="flex flex-col gap-2">
                                    <label className="font-medium">Description / Details {mode === 'verify' ? '(Paste job description)' : '(Describe the scam)'} *</label>
                                    <textarea
                                          name="description"
                                          value={formData.description}
                                          onChange={handleInputChange}
                                          rows={5}
                                          placeholder={mode === 'verify' ? "Paste the full job description here..." : "Explain what happened (e.g. asked for money)..."}
                                          className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full text-base focus:border-[var(--primary)] outline-none transition-colors resize-y"
                                    />
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                                          w-full py-3 md:py-4 mt-2 rounded-lg text-white text-lg font-bold transition-all flex justify-center items-center gap-2
                                          ${mode === 'verify' ? 'bg-[var(--primary)] hover:bg-indigo-700' : 'bg-[var(--secondary)] hover:bg-pink-700'}
                                          disabled:opacity-70 disabled:cursor-not-allowed
                                    `}
                              >
                                    {loading ? 'Processing...' : (mode === 'verify' ? 'Analyze Risk' : 'Submit Report')}
                              </button>

                              {message && <p className="text-center text-[var(--text-muted)] mt-2">{message}</p>}
                        </form>
                  </motion.div>

                  {/* Results Section */}
                  {result && mode === 'verify' && (
                        <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-12 max-w-2xl mx-auto"
                        >
                              <div className={`bg-[var(--surface)] p-6 md:p-8 rounded-2xl border-2 shadow-sm ${getRiskBorderColor(result.trustScore)}`}>
                                    <h2 className="text-2xl font-bold text-center mb-8">Safety Analysis</h2>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                          <div className="text-center flex-shrink-0">
                                                <div
                                                      className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 border-8"
                                                      style={{ borderColor: getRiskColor(result.trustScore) }}
                                                >
                                                      {result.trustScore}%
                                                </div>
                                                <p className="font-medium text-[var(--text-muted)]">Trust Score</p>
                                          </div>

                                          <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-4">Risk Factors Found: {result.riskFactors.length}</h3>
                                                <ul className="space-y-3">
                                                      {result.riskFactors.length === 0 && (
                                                            <li className="flex gap-2 text-emerald-500 font-medium">
                                                                  <CheckCircle size={20} className="flex-shrink-0" /> No obvious red flags detected.
                                                            </li>
                                                      )}
                                                      {result.riskFactors.map((risk, idx) => (
                                                            <li key={idx} className={`flex gap-2 ${risk.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                                                                  <AlertTriangle size={20} className="flex-shrink-0 mt-1" />
                                                                  <span><span className="font-bold">[{risk.riskType}]</span> {risk.description}</span>
                                                            </li>
                                                      ))}
                                                </ul>
                                                {result.reportCount > 0 && <p className="text-red-500 mt-4 font-semibold flex items-center gap-2">⚠️ Found {result.reportCount} community report(s) matching this company.</p>}

                                                {result.trustScore >= 70 && formData.jobUrl && (
                                                      <motion.a
                                                            href={formData.jobUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="inline-block mt-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/30 text-center w-full md:w-auto"
                                                      >
                                                            Job looks Safe! Apply Now 🚀
                                                      </motion.a>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        </motion.div>
                  )}
            </div>
      );
};

const getRiskColor = (score: number) => {
      if (score >= 80) return '#4ade80'; // Green
      if (score >= 50) return '#fbbf24'; // Yellow
      return '#ef4444'; // Red
};

const getRiskBorderColor = (score: number) => {
      if (score >= 80) return 'border-emerald-400';
      if (score >= 50) return 'border-amber-400';
      return 'border-red-500';
};

export default ScamCheck;
