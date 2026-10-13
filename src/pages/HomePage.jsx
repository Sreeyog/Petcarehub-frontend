import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  Scissors, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  ArrowRight, 
  Clock, 
  FileCheck2, 
  Users, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ setCurrentView }) {
  const { isLoggedIn, user } = useAuth();
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.services.getAll().then(res => setServices(res || [])).catch(() => {});
    api.admin.getStats().then(res => setStats(res || null)).catch(() => {});
  }, []);

  const categories = ['ALL', 'VETERINARY', 'GROOMING', 'BOARDING', 'TRAINING', 'DENTAL'];

  const filteredServices = activeCategory === 'ALL' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div style={{ maxWidth: '850px' }}>
            <div className="hero-badge">
              <Activity size={15} />
              <span>CLINICAL VETERINARY &amp; PET CARE PLATFORM</span>
            </div>

            <h1 className="hero-title">
              Precision Care &amp; Health Trajectories for <span className="highlight">Every Companion.</span>
            </h1>

            <p className="hero-subtitle">
              PetCareHub seamlessly connects pet owners with board-certified veterinarians and premier pet care providers. Manage electronic health records, track vaccination schedules, and schedule everyday care in one clinical system.
            </p>

            <div className="hero-ctas">
              {isLoggedIn ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setCurrentView('dashboard')}
                  id="hero-btn-dashboard"
                >
                  <span>Open Your {user.role === 'ROLE_VETERINARIAN' ? 'Clinical Workstation' : 'Dashboard'}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => setCurrentView('auth-register')}
                    id="hero-btn-register"
                  >
                    <span>Register Pet Patient</span>
                    <ArrowRight size={16} />
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('auth-login')}
                    id="hero-btn-login"
                  >
                    Access Healthcare Portal
                  </button>
                </>
              )}
              <button 
                type="button" 
                className="btn btn-outline-primary"
                onClick={() => setCurrentView('services')}
                id="hero-btn-services"
              >
                Browse Care Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live System Telemetry Banner */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '1.75rem 0' }}>
        <div className="container">
          <div className="stat-grid" style={{ marginBottom: 0 }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                <Stethoscope size={22} />
              </div>
              <div>
                <div className="stat-val">{stats?.totalVeterinarians || 1}</div>
                <div className="stat-label">Licensed Veterinarians</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
                <FileCheck2 size={22} />
              </div>
              <div>
                <div className="stat-val">{stats?.totalAppointments || 0}</div>
                <div className="stat-label">Appointments Scheduled</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#92400e' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="stat-val">{stats?.totalVaccinations || 0}</div>
                <div className="stat-label">Immunizations Certified</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                <Users size={22} />
              </div>
              <div>
                <div className="stat-val">{stats?.totalUsers || 4}</div>
                <div className="stat-label">Registered Network Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Ecosystem Architecture</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Designed for Comprehensive Care</h2>
            <p>Unified medical histories, real-time diagnostic logs, and effortless grooming &amp; veterinary scheduling.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card">
              <div className="brand-icon-box" style={{ marginBottom: '1.25rem', backgroundColor: '#0284c7' }}>
                <Stethoscope size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Electronic Medical Records (EMR)</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Veterinarians log clinical diagnoses, vital signs telemetry, treatment regimens, lab summaries, and follow-up schedules. Pet owners retain lifetime digital access.
              </p>
            </div>

            <div className="card">
              <div className="brand-icon-box" style={{ marginBottom: '1.25rem', backgroundColor: '#059669' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Immunization Passports &amp; Alerts</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Track core vaccines (Rabies, DHPP, Bordetella, FVRCP) with manufacturer batch serial numbers, automated booster countdowns, and overdue notification badges.
              </p>
            </div>

            <div className="card">
              <div className="brand-icon-box" style={{ marginBottom: '1.25rem', backgroundColor: '#d97706' }}>
                <Scissors size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Grooming &amp; Boarding Services</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Book specialized care providers for hydro-baths, styling, climate-controlled overnight boarding suites, and canine behavioral conditioning sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clinical Services Catalog */}
      <section style={{ padding: '3rem 0 4.5rem', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Official Catalog</span>
              <h2 style={{ fontSize: '1.85rem' }}>Clinical &amp; Care Services Directory</h2>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentView('services')}
            >
              View Full Directory ({services.length})
            </button>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.75rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredServices.slice(0, 6).map(service => (
              <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-info">{service.category}</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-mono)' }}>
                    ₹{service.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{service.name}</h4>
                <p style={{ fontSize: '0.85rem', flex: 1, marginBottom: '1rem', lineHeight: 1.5 }}>
                  {service.description}
                </p>

                <div style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} />
                    <span>{service.durationMinutes} minutes</span>
                  </div>
                  {service.provider && (
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {service.provider.fullName}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.85rem', width: '100%' }}
                  onClick={() => {
                    if (isLoggedIn) {
                      setCurrentView('dashboard');
                    } else {
                      setCurrentView('auth-login');
                    }
                  }}
                >
                  <Calendar size={14} />
                  <span>Book This Service</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Assistance Banner */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--bg-surface-subtle)' }}>
        <div className="container">
          <div className="card" style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#ffffff',
            padding: '2.5rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <span className="badge badge-danger" style={{ marginBottom: '0.75rem', backgroundColor: '#ef4444', color: '#fff' }}>
                Urgent Veterinary Care
              </span>
              <h3 style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Experiencing a Pet Emergency?
              </h3>
              <p style={{ color: '#94a3b8', maxWidth: '600px' }}>
                Our affiliated clinical emergency hospitals operate continuous 24/7 triage units. Contact our immediate response operator or find the nearest on-call veterinarian.
              </p>
            </div>
            <a 
              href="tel:+911800123738" 
              className="btn btn-primary"
              style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', padding: '0.8rem 1.5rem', fontSize: '1rem' }}
            >
              <PhoneCall size={18} />
              <span>Call Emergency Desk (1800-123-PETS)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
