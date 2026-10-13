import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Stethoscope, Scissors, UserCheck } from 'lucide-react';

export default function QuickLoginBanner({ onLoginSuccess }) {
  const { login } = useAuth();

  const handleQuickLogin = async (email, password) => {
    try {
      await login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="quick-seed-bar">
      <div className="container quick-seed-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>Quick Evaluation Credentials:</span>
        </div>
        <div className="quick-seed-chips">
          <button
            type="button"
            className="seed-chip-btn"
            id="quick-login-owner"
            onClick={() => handleQuickLogin('owner@petcarehub.com', 'owner123')}
            title="Log in as Pet Owner (Alex Morgan)"
          >
            <UserCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Owner: owner@petcarehub.com
          </button>

          <button
            type="button"
            className="seed-chip-btn"
            id="quick-login-vet"
            onClick={() => handleQuickLogin('vet@petcarehub.com', 'vet123')}
            title="Log in as Veterinarian (Dr. Sarah Jenkins)"
          >
            <Stethoscope size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Vet: vet@petcarehub.com
          </button>

          <button
            type="button"
            className="seed-chip-btn"
            id="quick-login-groomer"
            onClick={() => handleQuickLogin('groomer@petcarehub.com', 'groomer123')}
            title="Log in as Service Provider (Paws & Spa Studio)"
          >
            <Scissors size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Groomer: groomer@petcarehub.com
          </button>

          <button
            type="button"
            className="seed-chip-btn"
            id="quick-login-admin"
            onClick={() => handleQuickLogin('admin@petcarehub.com', 'admin123')}
            title="Log in as Administrator"
          >
            <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Admin: admin@petcarehub.com
          </button>
        </div>
      </div>
    </div>
  );
}
