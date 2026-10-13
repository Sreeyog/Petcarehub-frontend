import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle,
  UserCheck,
  Scissors,
  ShieldCheck
} from 'lucide-react';

export default function AuthPage({ defaultMode = 'login', onAuthSuccess }) {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState(defaultMode); // 'login' or 'register'
  const [error, setError] = useState('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_PET_OWNER',
    address: '',
    clinicOrBusinessName: '',
    specialization: '',
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginEmail, loginPassword);
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(regData);
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    }
  };

  const fillQuickCredentials = (email, password) => {
    setMode('login');
    setLoginEmail(email);
    setLoginPassword(password);
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        {/* Quick Credentials Card */}
        <div className="card" style={{
          marginBottom: '1.5rem',
          backgroundColor: 'var(--bg-surface-subtle)',
          padding: '1rem',
          border: '1px dashed var(--border-strong)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Instant Evaluation Credentials (1-Click Fill):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickCredentials('owner@petcarehub.com', 'owner123')}
            >
              <UserCheck size={13} />
              <span>Pet Owner</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickCredentials('vet@petcarehub.com', 'vet123')}
            >
              <Stethoscope size={13} />
              <span>Veterinarian</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickCredentials('groomer@petcarehub.com', 'groomer123')}
            >
              <Scissors size={13} />
              <span>Provider</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickCredentials('admin@petcarehub.com', 'admin123')}
            >
              <ShieldCheck size={13} />
              <span>Administrator</span>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div className="brand-icon-box" style={{ margin: '0 auto 1rem', width: '3rem', height: '3rem' }}>
              <HeartPulse size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>
              {mode === 'login' ? 'Clinical Portal Access' : 'Create PetCareHub Account'}
            </h2>
            <p style={{ fontSize: '0.875rem' }}>
              {mode === 'login'
                ? 'Sign in to access your pets, appointments, and medical charts.'
                : 'Join the integrated pet healthcare network.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                flex: 1,
                backgroundColor: mode === 'login' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'login' ? 'var(--primary-600)' : 'var(--text-secondary)',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
              }}
              onClick={() => { setMode('login'); setError(''); }}
              id="tab-login"
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                flex: 1,
                backgroundColor: mode === 'register' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'register' ? 'var(--primary-600)' : 'var(--text-secondary)',
                boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
              }}
              onClick={() => { setMode('register'); setError(''); }}
              id="tab-register"
            >
              Register Account
            </button>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger-text)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="doctor@hospital.com or owner@mail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    id="login-email-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  id="login-password-input"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={isLoading}
                id="btn-submit-login"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Account Role *</label>
                <select
                  className="form-select"
                  value={regData.role}
                  onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                  id="register-role-select"
                >
                  <option value="ROLE_PET_OWNER">Pet Owner (Manage Pets &amp; Appointments)</option>
                  <option value="ROLE_VETERINARIAN">Veterinarian (Doctor / Diagnostic Consultations)</option>
                  <option value="ROLE_SERVICE_PROVIDER">Care Service Provider (Grooming / Boarding)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Sarah Jenkins, Alex Morgan"
                  value={regData.fullName}
                  onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                  required
                  id="reg-fullname-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. user@petcarehub.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  required
                  id="reg-email-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password * (Min 6 chars)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  required
                  minLength={6}
                  id="reg-password-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (+91 India)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  id="reg-phone-input"
                />
              </div>

              {regData.role === 'ROLE_VETERINARIAN' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Clinic / Hospital Affiliation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Apex Veterinary Hospital"
                      value={regData.clinicOrBusinessName}
                      onChange={(e) => setRegData({ ...regData, clinicOrBusinessName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialization / Board Certification</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Feline Internal Medicine, Small Animal Surgery"
                      value={regData.specialization}
                      onChange={(e) => setRegData({ ...regData, specialization: e.target.value })}
                    />
                  </div>
                </>
              )}

              {regData.role === 'ROLE_SERVICE_PROVIDER' && (
                <div className="form-group">
                  <label className="form-label">Studio / Salon Business Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Paws & Spa Grooming Lounge"
                    value={regData.clinicOrBusinessName}
                    onChange={(e) => setRegData({ ...regData, clinicOrBusinessName: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Address / Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="City, State / Clinic Address"
                  value={regData.address}
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={isLoading}
                id="btn-submit-register"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
