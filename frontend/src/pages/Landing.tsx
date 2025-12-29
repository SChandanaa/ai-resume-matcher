import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, CheckCircle, Zap } from 'lucide-react';

const Landing = () => {
      return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                  {/* Hero Section */}
                  <section className="flex flex-col items-center text-center py-20">
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className="w-full max-w-4xl"
                        >
                              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-6 leading-tight">
                                    Analyze Your Resume with AI
                              </h1>
                              <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                                    Get instant feedback, ATS optimization tips, and job matching scores to land your dream job.
                              </p>

                              <Link to="/upload" className="inline-block">
                                    <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white border-0 py-4 px-8 text-lg rounded-full cursor-pointer shadow-lg shadow-indigo-500/40 flex items-center gap-2 transition-transform hover:-translate-y-1 active:translate-y-0">
                                          <Upload size={24} />
                                          <span>Scan Resume</span>
                                    </button>
                              </Link>
                        </motion.div>
                  </section>

                  {/* Features Grid */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 mb-20">
                        <FeatureCard
                              icon={<Zap className="text-[var(--secondary)]" size={32} />}
                              title="Instant Analysis"
                              description="Get results in seconds using our advanced AI algorithms."
                        />
                        <FeatureCard
                              icon={<CheckCircle className="text-emerald-500" size={32} />}
                              title="ATS Optimization"
                              description="Ensure your resume passes Applicant Tracking Systems."
                        />
                        <FeatureCard
                              icon={<Upload className="text-[var(--primary)]" size={32} />}
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
            className="p-8 bg-[var(--surface)] border border-slate-200 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-all"
      >
            {icon}
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{description}</p>
      </motion.div>
);

export default Landing;
