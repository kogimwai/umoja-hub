import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, children, mobile }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  if (mobile) return (
    <Link to={to} className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${active ? 'text-umoja-gold' : 'text-umoja-muted'}`}>
      {children}
    </Link>
  );
  return (
    <Link to={to} className={`relative text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-umoja-gold after:transition-all ${active ? 'text-umoja-gold after:w-full' : 'text-umoja-cream/70 hover:text-umoja-cream after:w-0 hover:after:w-full'}`}>
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-umoja-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-umoja-gold flex items-center justify-center font-display font-800 text-umoja-dark text-sm group-hover:scale-105 transition-transform">U</div>
            <span className="font-display font-bold text-lg tracking-tight">
              Umoja<span className="text-umoja-gold">Hub</span>
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/ai-assistant">AI Assistant</NavLink>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-umoja-cream/70 hover:text-umoja-cream transition-colors">
                  <div className="w-7 h-7 rounded-full bg-umoja-gold/20 border border-umoja-gold/40 flex items-center justify-center text-umoja-gold text-xs font-semibold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {user.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-sm text-umoja-muted hover:text-umoja-cream transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-umoja-cream/70 hover:text-umoja-cream transition-colors">Sign in</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-umoja-gold text-umoja-dark text-sm font-semibold hover:bg-umoja-gold-light transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-umoja-cream/70">
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-current mt-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current mt-1 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-umoja-gold/10 px-4 py-4 flex flex-col gap-4 anim-in">
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/ai-assistant">AI Assistant</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <button onClick={handleLogout} className="text-left text-sm text-umoja-muted">Sign out</button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1 text-center py-2 border border-umoja-gold/30 rounded-lg text-sm text-umoja-cream">Sign in</Link>
                <Link to="/register" className="flex-1 text-center py-2 bg-umoja-gold rounded-lg text-sm font-semibold text-umoja-dark">Get started</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav md:hidden flex justify-around items-center h-16">
        <NavLink to="/" mobile>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Home
        </NavLink>
        <NavLink to="/jobs" mobile>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Jobs
        </NavLink>
        <NavLink to="/marketplace" mobile>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Market
        </NavLink>
        <NavLink to="/ai-assistant" mobile>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          AI
        </NavLink>
        <NavLink to={user ? "/dashboard" : "/login"} mobile>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          {user ? 'Profile' : 'Login'}
        </NavLink>
      </div>

      {/* Spacer */}
      <div className="h-
