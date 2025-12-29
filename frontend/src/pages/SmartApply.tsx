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
            <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--text)' }}>
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginBottom: '3rem' }}
                  >
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                              Smart Application Assistant
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                              Paste a job from LinkedIn or Naukri. We'll pick your best resume for it.
                        </p>
                  </motion.div>

                  <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem', transition: 'all 0.5s ease' }}>

                        {/* Input Form */}
                        <motion.div
                              layout
                              style={{
                                    background: 'var(--surface)',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    border: '1px solid var(--glass-border)',
                                    boxShadow: 'var(--shadow-card)',
                                    height: 'fit-content'
                              }}
                        >
                              <form onSubmit={handleMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                          <label>Job Link (LinkedIn / Naukri)</label>
                                          <input
                                                type="url"
                                                value={formData.jobUrl}
                                                onChange={e => setFormData({ ...formData, jobUrl: e.target.value })}
                                                placeholder="https://..."
                                                style={inputStyle}
                                          />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                          <label>Job Description (Paste here for matching)</label>
                                          <textarea
                                                required
                                                rows={10}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Paste the full job description..."
                                                style={inputStyle}
                                          />
                                    </div>

                                    <button
                                          type="submit"
                                          disabled={loading}
                                          style={{
                                                padding: '1rem',
                                                background: 'var(--primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                cursor: loading ? 'wait' : 'pointer',
                                                opacity: loading ? 0.7 : 1
                                          }}
                                    >
                                          {loading ? 'Analyzing Resumes...' : 'Find Best Resume'}
                                    </button>
                                    {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
                              </form>
                        </motion.div>

                        {/* Results Panel */}
                        {result && (
                              <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                          background: 'var(--surface)',
                                          padding: '2rem',
                                          borderRadius: '16px',
                                          border: '1px solid #3b82f6',
                                          boxShadow: 'var(--shadow-card)',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '1.5rem'
                                    }}
                              >
                                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                          <CheckCircle color="#10b981" /> Best Match Found
                                    </h2>

                                    <div style={{
                                          background: 'rgba(59, 130, 246, 0.1)',
                                          padding: '1.5rem',
                                          borderRadius: '12px',
                                          border: '1px solid rgba(59, 130, 246, 0.3)'
                                    }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <FileText size={32} color="#3b82f6" />
                                                <div>
                                                      <h3 style={{ margin: 0 }}>{result.bestMatch.fileName}</h3>
                                                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>{result.bestMatch.score}% Relevance Score</span>
                                                </div>
                                          </div>
                                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {result.bestMatch.matchExplanation}
                                          </p>
                                    </div>

                                    <div style={{ marginTop: 'auto' }}>
                                          <p style={{ marginBottom: '1rem' }}>Ready to apply? We've selected this resume for you.</p>

                                          {result.jobUrl ? (
                                                <a
                                                      href={result.jobUrl}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.5rem',
                                                            background: 'white',
                                                            color: 'black',
                                                            padding: '1rem',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            fontWeight: 'bold',
                                                            transition: 'transform 0.2s'
                                                      }}
                                                >
                                                      Continue to Application <ExternalLink size={18} />
                                                </a>
                                          ) : (
                                                <button disabled style={{ width: '100%', padding: '1rem', opacity: 0.5 }}>No URL Provided</button>
                                          )}
                                    </div>

                                    {/* Other Matches List */}
                                    {result.allMatches.length > 1 && (
                                          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                                <h4 style={{ color: 'var(--text-muted)' }}>Other Candidates:</h4>
                                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                                      {result.allMatches.slice(1, 4).map(match => (
                                                            <li key={match._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-muted)' }}>
                                                                  <span>{match.fileName}</span>
                                                                  <span>{match.score}%</span>
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

const inputStyle = {
      background: 'var(--input-bg)',
      border: '1px solid var(--glass-border)',
      padding: '0.8rem',
      borderRadius: '8px',
      color: 'var(--text)',
      fontFamily: 'inherit',
      fontSize: '1rem',
      width: '100%'
};

export default SmartApply;
