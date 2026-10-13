import React from 'react';
import { HeartPulse, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '2.5rem 0 1.5rem',
      marginTop: 'auto',
      transition: 'background-color 0.25s ease'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div className="brand-icon-box" style={{ width: '2rem', height: '2rem' }}>
                <HeartPulse size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>PetCare<span style={{ color: 'var(--primary-600)' }}>Hub</span></span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A full-stack clinical pet care platform empowering owners, veterinarians, and service providers with unified medical history, vaccination monitoring, and scheduling.
            </p>
          </div>




          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Emergency Care Desk
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              24/7 Veterinary triage assistance and urgent hospital referrals.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#ef4444' }}>
              <PhoneCall size={15} />
              <span>Emergency Hotline: 1800-123-PETS (+91 98765 00199)</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span>&copy; {new Date().getFullYear()} PetCareHub Inc. All clinical rights reserved.</span>
          <span>Designed with Clean Clinical Veterinary architecture &bull; Built with Spring Boot &amp; React</span>
        </div>
      </div>
    </footer>
  );
}
