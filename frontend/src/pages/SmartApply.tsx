import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { FileText, ExternalLink, CheckCircle } from 'lucide-react';
import { findBestResume, type MatchResult } from '../services/jobService';
// In a real app, use Auth Context
const DEMO_USER_ID = "6935cc7143f7bdd9a2a13ee5";

const SmartApply = () => {
      const [formData, setFormData] = useState({
            jobUrl: '',
            description: ''
      });
      const [result, setResult] = useState<MatchResult | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      const handleMatch = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            setResult(null);

            try {
                  const data = await findBestResume({
                        userId: DEMO_USER_ID,
                        jobDescription: formData.description,
                        jobUrl: formData.jobUrl
                  });
                  setResult(data);
            } catch (err: any) {
                  setError(err.response?.data?.message || "Error finding best match. Ensure you have uploaded a resume.");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="max-w-5xl mx-auto p-4 md:p-8 text-[var(--text)]">
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                  >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                              Smart Application Assistant
                        </h1>
                        <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto">
                              Paste a job from LinkedIn or Naukri. We'll pick your best resume for it.
                        </p>
                  </motion.div>

                  <div className={`grid gap-8 transition-all duration-500 ${result ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>

                        {/* Input Form */}
                        <motion.div
                              layout
                              className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-[var(--glass-border)] shadow-sm h-fit"
                        >
                              <form onSubmit={handleMatch} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                          <label className="font-medium">Job Link (LinkedIn / Naukri)</label>
                                          <input
                                                type="url"
                                                value={formData.jobUrl}
                                                onChange={e => setFormData({ ...formData, jobUrl: e.target.value })}
                                                placeholder="https://..."
                                                className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full text-base focus:border-[var(--primary)] outline-none transition-colors"
                                          />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                          <label className="font-medium">Job Description (Paste here for matching)</label>
                                          <textarea
                                                required
                                                rows={10}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Paste the full job description..."
                                                className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full text-base focus:border-[var(--primary)] outline-none transition-colors resize-y"
                                          />
                                    </div>

                                    <button
                                          type="submit"
                                          disabled={loading}
                                          className={`
                                                w-full py-4 rounded-lg text-white font-bold bg-[var(--primary)] hover:bg-indigo-700 transition-colors
                                                disabled:opacity-70 disabled:cursor-wait
                                          `}
                                    >
                                          {loading ? 'Analyzing Resumes...' : 'Find Best Resume'}
                                    </button>
                                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                              </form>
                        </motion.div>

                        {/* Results Panel */}
                        {result && (
                              <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-blue-500 shadow-sm flex flex-col gap-6 h-fit"
                              >
                                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                                          <CheckCircle className="text-emerald-500" /> Best Match Found
                                    </h2>

                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                          <div className="flex items-center gap-4 mb-4">
                                                <FileText size={32} className="text-blue-500" />
                                                <div>
                                                      <h3 className="m-0 font-bold text-lg">{result.bestMatch.fileName}</h3>
                                                      <span className="text-emerald-600 font-bold">{result.bestMatch.score}% Relevance Score</span>
                                                </div>
                                          </div>
                                          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                                {result.bestMatch.matchExplanation}
                                          </p>
                                    </div>

                                    <div className="mt-auto">
                                          <p className="mb-4 text-center text-[var(--text-muted)]">Ready to apply? We've selected this resume for you.</p>

                                          {result.jobUrl ? (
                                                <a
                                                      href={result.jobUrl}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="flex items-center justify-center gap-2 bg-white text-black border border-slate-200 py-4 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm"
                                                >
                                                      Continue to Application <ExternalLink size={18} />
                                                </a>
                                          ) : (
                                                <button disabled className="w-full py-4 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed font-medium">No URL Provided</button>
                                          )}
                                    </div>

                                    {/* Other Matches List */}
                                    {result.allMatches.length > 1 && (
                                          <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                                                <h4 className="text-[var(--text-muted)] text-sm font-semibold mb-2">Other Candidates:</h4>
                                                <ul className="space-y-2">
                                                      {result.allMatches.slice(1, 4).map(match => (
                                                            <li key={match._id} className="flex justify-between text-sm text-[var(--text-muted)]">
                                                                  <span className="truncate max-w-[200px]">{match.fileName}</span>
                                                                  <span className="font-mono">{match.score}%</span>
                                                            </li>
                                                      ))}
                                                </ul>
                                          </div>
                                    )}
                              </motion.div>
                        )}

                  </div>
            </div>
      );
};

export default SmartApply;
