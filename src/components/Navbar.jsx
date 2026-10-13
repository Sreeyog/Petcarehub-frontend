import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  Calendar, 
  Stethoscope, 
  Scissors, 
  ShieldCheck, 
  LayoutDashboard,
  PawPrint
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, isLoggedIn, logout, theme, toggleTheme } = useAuth();

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case 'ROLE_VETERINARIAN': return 'Clinical Portal';
      case 'ROLE_SERVICE_PROVIDER': return 'Provider Desk';
      case 'ROLE_ADMIN': return 'Admin Center';
      default: return 'My Pet Hub';
    }
  };

  const getDashboardIcon = () => {
    if (!user) return <LayoutDashboard size={16} />;
    switch (user.role) {
      case 'ROLE_VETERINARIAN': return <Stethoscope size={16} />;
      case 'ROLE_SERVICE_PROVIDER': return <Scissors size={16} />;
      case 'ROLE_ADMIN': return <ShieldCheck size={16} />;
      default: return <PawPrint size={16} />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return <span className="badge badge-danger">Admin</span>;
      case 'ROLE_VETERINARIAN': return <span className="badge badge-info">Veterinarian</span>;
      case 'ROLE_SERVICE_PROVIDER': return <span className="badge badge-warning">Provider</span>;
      default: return <span className="badge badge-success">Pet Owner</span>;
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <div 
          className="brand-logo" 
          onClick={() => setCurrentView('home')} 
          style={{ cursor: 'pointer' }}
          id="nav-brand-logo"
        >
          <div className="brand-icon-box">
            <HeartPulse size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span>PetCare<span style={{ color: 'var(--primary-600)' }}>Hub</span></span>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              CLINICAL HEALTH NETWORK
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button 
                type="button" 
                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
                id="nav-link-home"
              >
                Overview
              </button>
            </li>
            <li>
              <button 
                type="button" 
                className={`nav-link ${currentView === 'services' ? 'active' : ''}`}
                onClick={() => setCurrentView('services')}
                id="nav-link-services"
              >
                Care Directory
              </button>
            </li>

            {isLoggedIn && (
              <li>
                <button 
                  type="button" 
                  className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setCurrentView('dashboard')}
                  id="nav-link-dashboard"
                >
                  {getDashboardIcon()}
                  {getDashboardLabel()}
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button 
            type="button" 
            className="btn btn-secondary btn-icon"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            id="theme-toggle-btn"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.fullName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                  {getRoleBadge(user.role)}
                </div>
              </div>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={logout}
                title="Sign Out"
                id="btn-logout"
              >
                <LogOut size={15} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentView('auth-login')}
                id="btn-nav-login"
              >
                Sign In
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setCurrentView('auth-register')}
                id="btn-nav-register"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
