import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, CheckCircle, Zap } from 'lucide-react';

const Landing = () => {
      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

                  {/* Hero Section */}
                  <section style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '5rem 0'
                  }}>
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                        >
                              <h1 style={{
                                    fontSize: '4rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '1rem'
                              }}>
                                    Analyze Your Resume with AI
                              </h1>
                              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                                    Get instant feedback, ATS optimization tips, and job matching scores to land your dream job.
                              </p>

                              <Link to="/upload">
                                    <button style={{
                                          background: 'linear-gradient(to right, var(--primary), var(--primary-hover))',
                                          color: 'white',
                                          border: 'none',
                                          padding: '1rem 2rem',
                                          fontSize: '1.1rem',
                                          borderRadius: '50px',
                                          cursor: 'pointer',
                                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.5rem'
                                    }}>
                                          <Upload size={20} />
                                          Start Free Scan
                                    </button>
                              </Link>
                        </motion.div>
                  </section>

                  {/* Features Grid */}
                  <section style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '4rem'
                  }}>
                        <FeatureCard
                              icon={<Zap color="var(--secondary)" size={32} />}
                              title="Instant Analysis"
                              description="Get results in seconds using our advanced AI algorithms."
                        />
                        <FeatureCard
                              icon={<CheckCircle color="#10b981" size={32} />}
                              title="ATS Optimization"
                              description="Ensure your resume passes Applicant Tracking Systems."
                        />
                        <FeatureCard
                              icon={<Upload color="var(--primary)" size={32} />}
                              title="Smart Matching"
                              description="See how well your resume matches specific job descriptions."
                        />
                  </section>

            </div>
      );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
      <motion.div
            whileHover={{ y: -5 }}
            style={{
                  padding: '2rem',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
            }}
      >
            {icon}
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
      </motion.div>
);

export default Landing;
