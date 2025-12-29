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
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text)' }}>
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: '3rem' }}
                  >
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #ec4899, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                              Job Safety & Verification
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                              Verify job listings and report scams to protect the community.
                        </p>
                  </motion.div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <button
                              onClick={() => setMode('verify')}
                              style={{
                                    padding: '0.8rem 2rem',
                                    background: mode === 'verify' ? 'var(--primary)' : 'transparent',
                                    border: `1px solid ${mode === 'verify' ? 'var(--primary)' : 'var(--surface)'}`,
                                    borderRadius: '8px',
                                    color: mode === 'verify' ? 'white' : 'var(--text)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s'
                              }}
                        >
                              <Search size={18} /> Verify Term
                        </button>
                        <button
                              onClick={() => setMode('report')}
                              style={{
                                    padding: '0.8rem 2rem',
                                    background: mode === 'report' ? 'var(--secondary)' : 'transparent',
                                    border: `1px solid ${mode === 'report' ? 'var(--secondary)' : 'var(--surface)'}`,
                                    borderRadius: '8px',
                                    color: mode === 'report' ? 'white' : 'var(--text)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s'
                              }}
                        >
                              <Shield size={18} /> Report Scam
                        </button>
                  </div>

                  <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: mode === 'verify' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                              background: 'var(--surface)',
                              padding: '2rem',
                              borderRadius: '16px',
                              border: '1px solid var(--glass-border)',
                              boxShadow: 'var(--shadow-card)',
                              maxWidth: '800px',
                              margin: '0 auto'
                        }}
                  >
                        <form onSubmit={mode === 'verify' ? handleVerify : handleReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                          <label>Company Name *</label>
                                          <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g. Acme Corp"
                                                style={inputStyle}
                                          />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                          <label>Recruiter Email</label>
                                          <input
                                                type="email"
                                                name="recruiterEmail"
                                                value={formData.recruiterEmail}
                                                onChange={handleInputChange}
                                                placeholder="recruiter@example.com"
                                                style={inputStyle}
                                          />
                                    </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>Job URL</label>
                                    <input
                                          type="url"
                                          name="jobUrl"
                                          value={formData.jobUrl}
                                          onChange={handleInputChange}
                                          placeholder="https://linkedin.com/jobs/..."
                                          style={inputStyle}
                                    />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>Description / Details {mode === 'verify' ? '(Paste job description)' : '(Describe the scam)'} *</label>
                                    <textarea
                                          name="description"
                                          value={formData.description}
                                          onChange={handleInputChange}
                                          rows={5}
                                          placeholder={mode === 'verify' ? "Paste the full job description here..." : "Explain what happened (e.g. asked for money)..."}
                                          style={inputStyle}
                                    />
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                          padding: '1rem',
                                          background: mode === 'verify' ? 'var(--primary)' : 'var(--secondary)',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '8px',
                                          fontSize: '1rem',
                                          cursor: 'pointer',
                                          fontWeight: 'bold',
                                          marginTop: '1rem'
                                    }}
                              >
                                    {loading ? 'Processing...' : (mode === 'verify' ? 'Analyze Risk' : 'Submit Report')}
                              </button>

                              {message && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{message}</p>}
                        </form>
                  </motion.div>

                  {/* Results Section */}
                  {result && mode === 'verify' && (
                        <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              style={{ marginTop: '3rem', maxWidth: '800px', margin: '3rem auto' }}
                        >
                              <div style={{
                                    background: 'var(--surface)',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    border: `1px solid ${getRiskColor(result.trustScore)}`,
                                    boxShadow: 'var(--shadow-card)'
                              }}>
                                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Safety Analysis</h2>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                                          <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                      width: '120px',
                                                      height: '120px',
                                                      borderRadius: '50%',
                                                      border: `8px solid ${getRiskColor(result.trustScore)}`,
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      fontSize: '2.5rem',
                                                      fontWeight: 'bold',
                                                      margin: '0 auto 1rem'
                                                }}>
                                                      {result.trustScore}%
                                                </div>
                                                <p>Trust Score</p>
                                          </div>

                                          <div style={{ flex: 1 }}>
                                                <h3>Risk Factors Found: {result.riskFactors.length}</h3>
                                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                                      {result.riskFactors.length === 0 && (
                                                            <li style={{ display: 'flex', gap: '0.5rem', color: '#4ade80', marginBottom: '0.5rem' }}>
                                                                  <CheckCircle size={20} /> No obvious red flags detected.
                                                            </li>
                                                      )}
                                                      {result.riskFactors.map((risk, idx) => (
                                                            <li key={idx} style={{ display: 'flex', gap: '0.5rem', color: risk.severity === 'critical' ? '#ef4444' : '#fbbf24', marginBottom: '0.5rem' }}>
                                                                  <AlertTriangle size={20} /> <span style={{ fontWeight: 'bold' }}>[{risk.riskType}]</span> {risk.description}
                                                            </li>
                                                      ))}
                                                </ul>
                                                {result.reportCount > 0 && <p style={{ color: '#ef4444', marginTop: '1rem' }}>⚠️ Found {result.reportCount} community report(s) matching this company.</p>}
                                                {result.trustScore >= 70 && formData.jobUrl && (
                                                      <motion.a
                                                            href={formData.jobUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            style={{
                                                                  display: 'inline-block',
                                                                  marginTop: '2rem',
                                                                  background: 'linear-gradient(to right, #10b981, #059669)',
                                                                  color: 'white',
                                                                  padding: '1rem 2rem',
                                                                  borderRadius: '50px',
                                                                  fontWeight: 'bold',
                                                                  textDecoration: 'none',
                                                                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                            }}
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

const inputStyle = {
      background: 'var(--input-bg)',
      border: '1px solid var(--glass-border)',
      padding: '0.8rem',
      borderRadius: '8px',
      color: 'var(--text)',
      fontFamily: 'inherit',
      fontSize: '1rem'
};

const getRiskColor = (score: number) => {
      if (score >= 80) return '#4ade80'; // Green
      if (score >= 50) return '#fbbf24'; // Yellow
      return '#ef4444'; // Red
};

export default ScamCheck;
