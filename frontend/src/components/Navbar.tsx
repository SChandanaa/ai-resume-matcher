import { Link, useNavigate } from 'react-router-dom';
import { FileText, Github, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

interface UserProfile {
      name: string;
      email: string;
      role: string;
}

const Navbar = () => {
      const navigate = useNavigate();
      const [user, setUser] = useState<UserProfile | null>(null);
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
                        // localStorage.removeItem('token'); // Optional: logout on fail
                  }
            };
            fetchUser();
      }, []);

      const handleLogout = () => {
            localStorage.removeItem('token');
            navigate('/login');
      };

      return (
            <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/80 border-b border-gray-200 sticky top-0 z-50">
                  <Link to="/home" className="flex items-center gap-2 text-gray-900 group">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                              <FileText size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">AI Resume Matcher</span>
                  </Link>

                  <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6">
                              <Link to="/home" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Home</Link>
                              <Link to="/upload" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Scan Resume</Link>
                              <Link to="/apply" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Apply Helper</Link>
                              <Link to="/dashboard" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Dashboard</Link>
                              <Link to="/scam-check" className="text-red-500 font-bold hover:text-red-600 transition-colors flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
                                    Verify Jobs 🛡️
                              </Link>
                        </div>

                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                        {/* About Icon / GitHub */}
                        <a
                              href="https://github.com/SChandanaa"
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-black transition-colors"
                              title="About / GitHub"
                        >
                              <Github size={22} />
                        </a>

                        {/* User Profile */}
                        {user ? (
                              <div className="relative">
                                    <button
                                          onClick={() => setShowDropdown(!showDropdown)}
                                          className="flex items-center gap-3 pl-2 transition-colors outline-none"
                                    >
                                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                                {user.name.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="hidden lg:block text-left">
                                                <p className="text-sm font-semibold text-gray-700 leading-none">{user.name.split(' ')[0]}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Candidate</p>
                                          </div>
                                    </button>

                                    {/* Dropdown */}
                                    {showDropdown && (
                                          <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-in fade-in zoom-in duration-200 origin-top-right overflow-hidden">
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
                                          </div>
                                    )}

                                    {/* Backdrop for dropdown */}
                                    {showDropdown && (
                                          <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)}></div>
                                    )}
                              </div>
                        ) : (
                              <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-md shadow-indigo-500/20 transition-all">
                                    Sign In
                              </Link>
                        )}
                  </div>
            </nav>
      );
};

export default Navbar;
