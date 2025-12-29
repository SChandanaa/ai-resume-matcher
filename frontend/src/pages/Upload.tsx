import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Upload = () => {
      const [file, setFile] = useState<File | null>(null);
      const [uploading, setUploading] = useState(false);
      const [success, setSuccess] = useState(false);
      const [error, setError] = useState<string | null>(null);

      // DEMO USER ID - For development only
      // In a real app, this would come from Auth Context
      const DEMO_USER_ID = "6935cc7143f7bdd9a2a13ee5";

      const onDrop = useCallback((acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                  setFile(acceptedFiles[0]);
                  setError(null);
                  setSuccess(false);
            }
      }, []);

      const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: {
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
            },
            maxFiles: 1
      });

      const navigate = useNavigate();

      const handleUpload = async () => {
            if (!file) return;

            setUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append('resume', file);
            formData.append('userId', DEMO_USER_ID);

            try {
                  await api.post('/resume/upload', formData, {
                        headers: {
                              'Content-Type': 'multipart/form-data',
                        },
                  });
                  setSuccess(true);
                  setFile(null);
                  setTimeout(() => navigate('/dashboard'), 1500);
            } catch (err: unknown) {
                  // ... error handling
                  console.error(err);
                  const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
                  const apiError = err as { response?: { data?: { message?: string } } };
                  setError(apiError.response?.data?.message || errorMessage);
            } finally {
                  setUploading(false);
            }
      };

      return (
            <div className="max-w-3xl mx-auto py-16 px-4 md:px-8">
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--surface)] p-8 md:p-12 rounded-3xl border border-[var(--glass-border)] shadow-sm text-center w-full"
                  >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text)]">
                              Upload Your Resume
                        </h2>
                        <p className="text-[var(--text-muted)] mb-8 md:mb-12">
                              Supported formats: PDF, DOC, DOCX
                        </p>

                        <div
                              {...getRootProps()}
                              className={`
                                    border-2 border-dashed rounded-2xl p-8 md:p-16 cursor-pointer transition-all duration-300 flex flex-col items-center gap-6 outline-none
                                    ${isDragActive ? 'border-[var(--primary)] bg-indigo-500/10' : 'border-[var(--glass-border)] bg-[var(--input-bg)] hover:border-[var(--primary)] hover:bg-slate-50'}
                              `}
                        >
                              <input {...getInputProps()} />

                              <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center shadow-lg">
                                    {file ? <FileText size={40} className="text-[var(--primary)]" /> : <UploadIcon size={40} className="text-[var(--text-muted)]" />}
                              </div>

                              <div className="flex flex-col gap-2">
                                    {file ? (
                                          <>
                                                <span className="text-xl font-semibold break-all">{file.name}</span>
                                                <span className="text-[var(--text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                          </>
                                    ) : (
                                          <>
                                                <span className="text-xl font-semibold">
                                                      {isDragActive ? 'Drop it here!' : 'Click to upload or drag & drop'}
                                                </span>
                                                <span className="text-[var(--text-muted)]">Maximum file size 5MB</span>
                                          </>
                                    )}
                              </div>
                        </div>

                        <AnimatePresence>
                              {error && (
                                    <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center justify-center gap-2"
                                    >
                                          <AlertCircle size={20} />
                                          {error}
                                    </motion.div>
                              )}

                              {success && (
                                    <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 flex items-center justify-center gap-2"
                                    >
                                          <CheckCircle size={20} />
                                          Resume uploaded successfully!
                                    </motion.div>
                              )}
                        </AnimatePresence>

                        {file && !success && (
                              <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpload();
                                    }}
                                    disabled={uploading}
                                    className={`
                                          mt-12 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-white border-none py-4 px-12 text-lg rounded-full 
                                          cursor-pointer shadow-lg shadow-indigo-500/40 inline-flex items-center gap-2 transition-all
                                          disabled:opacity-70 disabled:cursor-not-allowed
                                    `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                              >
                                    {uploading ? (
                                          <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Uploading...
                                          </>
                                    ) : (
                                          'Analyze Resume'
                                    )}
                              </motion.button>
                        )}
                  </motion.div>
            </div>
      );
};

export default Upload;
