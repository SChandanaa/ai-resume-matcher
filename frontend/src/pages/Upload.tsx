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

      // ... existing code ...

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
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                              background: 'var(--surface)',
                              padding: '3rem',
                              borderRadius: '24px',
                              border: '1px solid var(--glass-border)',
                              boxShadow: 'var(--shadow-card)',
                              width: '100%',
                              textAlign: 'center'
                        }}
                  >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text)' }}>
                              Upload Your Resume
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                              Supported formats: PDF, DOC, DOCX
                        </p>

                        <div
                              {...getRootProps()}
                              style={{
                                    border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--glass-border)'}`,
                                    borderRadius: '16px',
                                    padding: '4rem 2rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: isDragActive ? 'rgba(99, 102, 241, 0.1)' : 'var(--input-bg)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    outline: 'none'
                              }}
                        >
                              <input {...getInputProps()} />

                              <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'var(--surface)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                              }}>
                                    {file ? <FileText size={40} color="var(--primary)" /> : <UploadIcon size={40} color="var(--text-muted)" />}
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {file ? (
                                          <>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{file.name}</span>
                                                <span style={{ color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                          </>
                                    ) : (
                                          <>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                                      {isDragActive ? 'Drop it here!' : 'Click to upload or drag & drop'}
                                                </span>
                                                <span style={{ color: 'var(--text-muted)' }}>Maximum file size 5MB</span>
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
                                          style={{
                                                marginTop: '2rem',
                                                padding: '1rem',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                borderRadius: '12px',
                                                color: '#ef4444',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                          }}
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
                                          style={{
                                                marginTop: '2rem',
                                                padding: '1rem',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                                borderRadius: '12px',
                                                color: '#10b981',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                          }}
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
                                    style={{
                                          marginTop: '3rem',
                                          background: 'linear-gradient(to right, var(--primary), var(--primary-hover))',
                                          color: 'white',
                                          border: 'none',
                                          padding: '1rem 3rem',
                                          fontSize: '1.1rem',
                                          borderRadius: '50px',
                                          cursor: uploading ? 'not-allowed' : 'pointer',
                                          opacity: uploading ? 0.7 : 1,
                                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.5rem'
                                    }}
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
