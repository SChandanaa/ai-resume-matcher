import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Play, BarChart, FileText } from 'lucide-react';
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
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">

                  {/* Sidebar: Resume List */}
                  <div className="bg-[var(--surface)] p-6 rounded-2xl h-fit border border-[var(--glass-border)] shadow-sm">
                        <h3 className="mt-0 mb-6 text-[var(--text-muted)] font-semibold flex items-center gap-2">
                              <FileText size={20} /> My Resumes
                        </h3>
                        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                              {resumes.map((resume, index) => (
                                    <div
                                          key={resume._id}
                                          onClick={() => setSelectedResume(resume._id)}
                                          className={`p-4 rounded-xl cursor-pointer flex items-start gap-3 transition-all border ${selectedResume === resume._id
                                                      ? 'bg-[var(--primary)] text-white border-transparent shadow-lg shadow-indigo-500/20'
                                                      : 'bg-[var(--background)] hover:bg-slate-100 border-slate-200'
                                                }`}
                                    >
                                          <div className={`min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-bold mt-[2px] ${selectedResume === resume._id ? 'bg-white/20' : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                {index + 1}
                                          </div>
                                          <div className="overflow-hidden w-full">
                                                <div className="font-medium truncate leading-tight" title={resume.fileName}>
                                                      {resume.fileName}
                                                </div>
                                                <div className={`text-xs mt-1 ${selectedResume === resume._id ? 'opacity-80' : 'text-slate-500'}`}>
                                                      {new Date(resume.uploadedAt).toLocaleDateString()}
                                                </div>
                                          </div>
                                    </div>
                              ))}
                              {resumes.length === 0 && <p className="text-[var(--text-muted)] italic text-center py-4">No resumes uploaded yet.</p>}
                        </div>
                  </div>

                  {/* Main Content: Matcher */}
                  <div className="flex flex-col gap-8">

                        {/* Input Section */}
                        <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--glass-border)] shadow-sm"
                        >
                              <h2 className="text-2xl md:text-3xl font-bold mt-0 flex items-center gap-3 mb-6">
                                    <BarChart className="text-[var(--secondary)]" />
                                    Scan Job Description
                              </h2>

                              <textarea
                                    placeholder="Paste the Job Description (JD) here to match against your resume..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full h-48 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-base resize-y transition-all"
                              />

                              <div className="mt-6 flex justify-end">
                                    <button
                                          onClick={handleMatch}
                                          disabled={loading || !selectedResume || !jobDescription}
                                          className={`
                                                bg-gradient-to-r from-[var(--secondary)] to-pink-600 text-white border-0 py-4 px-8 text-lg rounded-full 
                                                cursor-pointer flex items-center gap-2 font-semibold shadow-lg shadow-pink-500/30 transition-all
                                                hover:-translate-y-1 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                                          `}
                                    >
                                          {loading ? 'Analyzing...' : <> <Play size={20} fill="currentColor" /> Match Resume </>}
                                    </button>
                              </div>
                        </motion.div>

                        {/* Results Section */}
                        {matchResult && (
                              <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--glass-border)] shadow-sm"
                              >
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                          <div>
                                                <h3 className="m-0 text-2xl font-bold">Match Result</h3>
                                                <p className="text-[var(--text-muted)] mt-2 text-lg">{matchResult.feedback}</p>
                                          </div>
                                          <div className="relative w-24 h-24 flex-shrink-0">
                                                <div
                                                      className="absolute inset-0 rounded-full"
                                                      style={{
                                                            background: `conic-gradient(${matchResult.score > 70 ? '#10b981' : matchResult.score > 40 ? '#f59e0b' : '#ef4444'} ${matchResult.score}%, transparent 0)`
                                                      }}
                                                />
                                                <div className="absolute inset-[6px] bg-[var(--surface)] rounded-full flex items-center justify-center">
                                                      <span className="text-2xl font-bold">{matchResult.score}%</span>
                                                </div>
                                          </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                <h4 className="m-0 mb-4 flex items-center gap-2 text-emerald-600 font-bold">
                                                      <CheckCircle size={20} /> Matched Keywords
                                                </h4>
                                                <div className="text-4xl font-bold text-emerald-600">
                                                      {matchResult.matchedKeywords} <span className="text-lg opacity-70 font-normal text-emerald-800">/ {matchResult.totalKeywords}</span>
                                                </div>
                                          </div>

                                          <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                                <h4 className="m-0 mb-4 flex items-center gap-2 text-red-500 font-bold">
                                                      <AlertCircle size={20} /> Missing Keywords
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                      {matchResult.missingKeywords.length > 0 ? (
                                                            matchResult.missingKeywords.map(keyword => (
                                                                  <span key={keyword} className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-medium">
                                                                        {keyword}
                                                                  </span>
                                                            ))
                                                      ) : (
                                                            <span className="text-emerald-600 font-medium">None! Perfect Match.</span>
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
