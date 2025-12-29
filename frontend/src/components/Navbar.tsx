import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileText, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
      name: string;
      email: string;
      role: string;
}

const Navbar = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const [user, setUser] = useState<UserProfile | null>(null);
      const dropdownRef = useRef<HTMLDivElement>(null);
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

      const isActive = (path: string) => location.pathname === path;
      const getLinkClasses = (path: string) =>
            isActive(path)
                  ? "text-indigo-600 font-bold transition-colors"
                  : "text-gray-500 hover:text-indigo-600 font-medium transition-colors";

      const getMobileLinkClasses = (path: string) =>
            isActive(path)
                  ? "block px-4 py-2 text-indigo-600 font-bold bg-indigo-50 rounded-md"
                  : "block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 font-medium rounded-md transition-colors";

      const [showDropdown, setShowDropdown] = useState(false);

      useEffect(() => {
            const fetchUser = async () => {
                  try {
                        const token = localStorage.getItem('token');
                        if (token) {
                              const res = await api.get('/auth/me');
                              setUser(res.data);
                        }
                  } catch (error) {
                        console.error("Failed to fetch user", error);
                  }
            };
            fetchUser();
      }, []);

      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                        setShowDropdown(false);
                  }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                  document.removeEventListener('mousedown', handleClickOutside);
            };
      }, []);

      // Close mobile menu when route changes
      useEffect(() => {
            setIsMobileMenuOpen(false);
      }, [location]);

      const handleLogout = () => {
            localStorage.removeItem('token');
            navigate('/login');
      };

      return (
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                              {/* Logo */}
                              <Link to="/home" className="flex items-center gap-2 text-gray-900 group">
                                    <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                                          <FileText size={24} />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight">AI Resume Matcher</span>
                              </Link>

                              {/* Desktop Navigation */}
                              <div className="hidden md:flex items-center gap-8">
                                    <div className="flex items-center gap-6">
                                          <Link to="/home" className={getLinkClasses('/home')}>Home</Link>
                                          <Link to="/upload" className={getLinkClasses('/upload')}>Scan Resume</Link>
                                          <Link to="/dashboard" className={getLinkClasses('/dashboard')}>Match Resume</Link>
                                          <Link to="/apply" className={getLinkClasses('/apply')}>Apply Helper</Link>
                                          <Link to="/scam-check" className="text-red-500 font-bold hover:text-red-600 transition-colors flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
                                                Verify Jobs 🛡️
                                          </Link>
                                    </div>

                                    <div className="h-6 w-px bg-gray-200"></div>

                                    <Link to="/contact" className={getLinkClasses('/contact')}>Contact</Link>

                                    {/* User Profile Dropdown */}
                                    {user ? (
                                          <div className="relative" ref={dropdownRef}>
                                                <button
                                                      onClick={() => setShowDropdown(!showDropdown)}
                                                      className="flex items-center gap-3 pl-2 transition-colors outline-none cursor-pointer"
                                                >
                                                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                                            {user.name.charAt(0).toUpperCase()}
                                                      </div>
                                                </button>

                                                <AnimatePresence>
                                                      {showDropdown && (
                                                            <motion.div
                                                                  initial={{ opacity: 0, y: 10 }}
                                                                  animate={{ opacity: 1, y: 0 }}
                                                                  exit={{ opacity: 0, y: 10 }}
                                                                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 origin-top-right overflow-hidden"
                                                            >
                                                                  <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                                                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                                                                  </div>
                                                                  <div className="p-1">
                                                                        <button
                                                                              onClick={handleLogout}
                                                                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                                                                        >
                                                                              <LogOut size={16} />
                                                                              Sign Out
                                                                        </button>
                                                                  </div>
                                                            </motion.div>
                                                      )}
                                                </AnimatePresence>
                                          </div>
                                    ) : (
                                          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-md shadow-indigo-500/20 transition-all">
                                                Sign In
                                          </Link>
                                    )}
                              </div>

                              {/* Mobile menu button */}
                              <div className="flex md:hidden items-center gap-4">
                                    {user && (
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
                                                {user.name.charAt(0).toUpperCase()}
                                          </div>
                                    )}
                                    <button
                                          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Mobile Menu */}
                  <AnimatePresence>
                        {isMobileMenuOpen && (
                              <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="md:hidden border-t border-gray-200 bg-white"
                              >
                                    <div className="px-4 py-4 space-y-1">
                                          <Link to="/home" className={getMobileLinkClasses('/home')}>Home</Link>
                                          <Link to="/upload" className={getMobileLinkClasses('/upload')}>Scan Resume</Link>
                                          <Link to="/dashboard" className={getMobileLinkClasses('/dashboard')}>Match Resume</Link>
                                          <Link to="/apply" className={getMobileLinkClasses('/apply')}>Apply Helper</Link>
                                          <Link to="/scam-check" className={getMobileLinkClasses('/scam-check')}>Verify Jobs</Link>
                                          <Link to="/contact" className={getMobileLinkClasses('/contact')}>Contact</Link>
                                          {user ? (
                                                <button
                                                      onClick={handleLogout}
                                                      className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                                                >
                                                      <LogOut size={16} /> Sign Out
                                                </button>
                                          ) : (
                                                <Link to="/login" className="block w-full text-center bg-indigo-600 text-white font-medium py-2 rounded-lg mt-4">
                                                      Sign In
                                                </Link>
                                          )}
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </nav>
      );
};

export default Navbar;
