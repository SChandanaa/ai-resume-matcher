import { Link } from 'react-router-dom';
import { FileText, Github } from 'lucide-react';

const Navbar = () => {
      return (
            <nav style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 2rem',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'var(--glass)',
                  borderBottom: '1px solid var(--glass-border)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100
            }}>
                  <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                        <FileText size={28} color="var(--primary)" />
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>AI Resume Matcher</span>
                  </Link>

                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
                        <Link to="/upload" style={{ color: 'var(--text-muted)' }}>Scan Resume</Link>
                        <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>

                        <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text)' }}>
                              <Github size={20} />
                        </a>
                  </div>
            </nav>
      );
};

export default Navbar;
