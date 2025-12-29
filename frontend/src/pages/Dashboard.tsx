import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Play, BarChart } from 'lucide-react';
import api from '../services/api';

interface Resume {
      _id: string;
      fileName: string;
      uploadedAt: string;
}

interface MatchResult {
      score: number;
      totalKeywords: number;
      matchedKeywords: number;
      missingKeywords: string[];
      feedback: string;
}

const Dashboard = () => {
      const [resumes, setResumes] = useState<Resume[]>([]);
      const [selectedResume, setSelectedResume] = useState<string | null>(null);
      const [jobDescription, setJobDescription] = useState("");
      const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
      const [loading, setLoading] = useState(false);

      // DEMO USER ID - In prod this comes from Auth Context
      const DEMO_USER_ID = "6935cc7143f7bdd9a2a13ee5";

      useEffect(() => {
            fetchResumes();
      }, []);

      const fetchResumes = async () => {
            try {
                  const res = await api.get(`/resume/list/${DEMO_USER_ID}`);
                  setResumes(res.data);
                  if (res.data.length > 0) {
                        setSelectedResume(res.data[0]._id);
                  }
            } catch (err) {
                  console.error("Failed to fetch resumes", err);
            }
      };

      const handleMatch = async () => {
            if (!selectedResume || !jobDescription) return;

            setLoading(true);
            setMatchResult(null);

            try {
                  const res = await api.post('/resume/match', {
                        resumeId: selectedResume,
                        jobDescription
                  });
                  setMatchResult(res.data);
            } catch (err) {
                  console.error("Match failed", err);
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

                  {/* Sidebar: Resume List */}
                  <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', height: 'fit-content', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-muted)' }}>My Resumes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {resumes.map((resume) => (
                                    <div
                                          key={resume._id}
                                          onClick={() => setSelectedResume(resume._id)}
                                          style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                background: selectedResume === resume._id ? 'var(--primary)' : 'var(--item-hover)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.8rem',
                                                transition: 'all 0.2s',
                                                border: selectedResume === resume._id ? '1px solid transparent' : '1px solid var(--glass-border)'
                                          }}
                                    >
                                          <FileText size={20} />
                                          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                <div style={{ fontWeight: 500 }}>{resume.fileName}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(resume.uploadedAt).toLocaleDateString()}</div>
                                          </div>
                                    </div>
                              ))}
                              {resumes.length === 0 && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No resumes uploaded yet.</p>}
                        </div>
                  </div>

                  {/* Main Content: Matcher */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Input Section */}
                        <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}
                        >
                              <h2 style={{ fontSize: '1.8rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <BarChart color="var(--secondary)" />
                                    Scan Job Description
                              </h2>

                              <textarea
                                    placeholder="Paste the Job Description (JD) here to match against your resume..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    style={{
                                          width: '100%',
                                          height: '200px',
                                          padding: '1rem',
                                          borderRadius: '12px',
                                          background: 'var(--input-bg)',
                                          border: '1px solid var(--glass-border)',
                                          color: 'var(--text)',
                                          fontSize: '1rem',
                                          margin: '1.5rem 0',
                                          fontFamily: 'inherit',
                                          resize: 'vertical'
                                    }}
                              />

                              <button
                                    onClick={handleMatch}
                                    disabled={loading || !selectedResume || !jobDescription}
                                    style={{
                                          background: 'linear-gradient(to right, var(--secondary), #ec4899)',
                                          color: 'white',
                                          border: 'none',
                                          padding: '1rem 3rem',
                                          fontSize: '1.1rem',
                                          borderRadius: '50px',
                                          cursor: (loading || !selectedResume || !jobDescription) ? 'not-allowed' : 'pointer',
                                          opacity: (loading || !selectedResume || !jobDescription) ? 0.6 : 1,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.6rem',
                                          fontWeight: 600
                                    }}
                              >
                                    {loading ? 'Analyzing...' : <> <Play size={20} fill="currentColor" /> Match Resume </>}
                              </button>
                        </motion.div>

                        {/* Results Section */}
                        {matchResult && (
                              <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}
                              >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                          <div>
                                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Match Result</h3>
                                                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>{matchResult.feedback}</p>
                                          </div>
                                          <div style={{
                                                width: '80px', height: '80px', borderRadius: '50%',
                                                background: `conic-gradient(${matchResult.score > 70 ? '#10b981' : matchResult.score > 40 ? '#f59e0b' : '#ef4444'} ${matchResult.score}%, transparent 0)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                position: 'relative'
                                          }}>
                                                <div style={{ position: 'absolute', inset: '5px', borderRadius: '50%', background: 'var(--surface)' }} />
                                                <span style={{ position: 'relative', fontSize: '1.5rem', fontWeight: 'bold' }}>{matchResult.score}%</span>
                                          </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                          <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                                <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                                                      <CheckCircle size={18} /> Matched Keywords
                                                </h4>
                                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                                                      {matchResult.matchedKeywords} <span style={{ fontSize: '1rem', opacity: 0.7, fontWeight: 'normal' }}>/ {matchResult.totalKeywords}</span>
                                                </div>
                                          </div>

                                          <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                                                      <AlertCircle size={18} /> Missing Keywords
                                                </h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                      {matchResult.missingKeywords.length > 0 ? (
                                                            matchResult.missingKeywords.map(keyword => (
                                                                  <span key={keyword} style={{
                                                                        background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444',
                                                                        padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem'
                                                                  }}>
                                                                        {keyword}
                                                                  </span>
                                                            ))
                                                      ) : (
                                                            <span style={{ color: '#10b981' }}>None! Perfect Match.</span>
                                                      )}
                                                </div>
                                          </div>
                                    </div>
                              </motion.div>
                        )}

                  </div>
            </div>
      );
};

export default Dashboard;
