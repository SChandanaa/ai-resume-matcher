import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { FcGoogle } from 'react-icons/fc'; // Removed as react-icons might not be installed
// import { FaGithub } from 'react-icons/fa'; // Removed as react-icons might not be installed
import { Github, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'; // Use Lucide for consistent icons
import { API_URL } from '../services/api';

const Login = () => {
      const navigate = useNavigate();
      const [searchParams] = useSearchParams();
      const [isLoading, setIsLoading] = useState(false);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      // Check for auth token from OAuth callback
      useEffect(() => {
            const token = searchParams.get('token');
            if (token) {
                  localStorage.setItem('token', token);
                  navigate('/dashboard');
            }
      }, [searchParams, navigate]);

      const handleLogin = (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
            // Simulate login for now or call backend
            // In a real app, you would call your backend login API here
            setTimeout(() => {
                  setIsLoading(false);
                  navigate('/dashboard');
            }, 1500);
      };

      const handleGoogleLogin = () => {
            window.location.href = `${API_URL}/auth/google`;
      };

      const handleGithubLogin = () => {
            window.location.href = `${API_URL}/auth/github`;
      };

      return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                  {/* Background Decor */}
                  <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />

                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 z-10"
                  >
                        <div className="text-center mb-8">
                              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    Welcome Back
                              </h1>
                              <p className="text-slate-500">Sign in to continue to AI Resume Matcher</p>
                        </div>

                        <div className="space-y-4 mb-8">
                              <button
                                    onClick={handleGoogleLogin}
                                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                    <div className="w-6 h-6 flex items-center justify-center font-bold text-lg text-red-500">G</div>
                                    <span>Continue with Google</span>
                              </button>

                              <button
                                    onClick={handleGithubLogin}
                                    className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                    <Github className="text-2xl" />
                                    <span>Continue with GitHub</span>
                              </button>
                        </div>

                        <div className="relative mb-8">
                              <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                              </div>
                              <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white/50 backdrop-blur-sm text-slate-500">Or continue with email</span>
                              </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                              <div className="group">
                                    <div className="relative">
                                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                          <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email address"
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder:text-slate-400"
                                          />
                                    </div>
                              </div>

                              <div className="group">
                                    <div className="relative">
                                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                          <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-3 pl-10 pr-4 outline-none transition-all placeholder:text-slate-400"
                                          />
                                    </div>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                          <span className="text-slate-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
                              </div>

                              <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                    {isLoading ? (
                                          <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                          <>
                                                <span>Sign In</span>
                                                <ArrowRight size={20} />
                                          </>
                                    )}
                              </button>
                        </form>

                        <p className="text-center mt-8 text-slate-600">
                              Don't have an account?{' '}
                              <a href="#" className="text-indigo-600 font-bold hover:underline">Sign up</a>
                        </p>
                  </motion.div>
            </div>
      );
};

export default Login;
