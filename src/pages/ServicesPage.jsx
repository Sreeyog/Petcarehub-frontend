import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, Search, Tag, Stethoscope, Scissors } from 'lucide-react';
import BookAppointmentModal from '../components/BookAppointmentModal';

export default function ServicesPage({ setCurrentView }) {
  const { isLoggedIn } = useAuth();
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
    if (isLoggedIn) {
      api.pets.getMy().then(res => setPets(res || [])).catch(() => {});
    }
  }, [isLoggedIn]);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const res = await api.services.getAll();
      setServices(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClick = (service) => {
    if (!isLoggedIn) {
      setCurrentView('auth-login');
      return;
    }
    setPreselectedService(service);
    setIsBookModalOpen(true);
  };

  const categories = ['ALL', 'VETERINARY', 'GROOMING', 'BOARDING', 'TRAINING', 'DENTAL'];

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
        <span className="badge badge-info" style={{ marginBottom: '0.6rem' }}>Clinical &amp; Care Catalog</span>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Pet Health &amp; Care Directory</h1>
        <p>
          Discover comprehensive veterinary consultations, diagnostic evaluations, grooming spa therapies, and behavioral conditioning programs.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search care services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2rem' }}
          />
          <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Grid */}
      {filteredServices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p>No care services matched your filter criteria.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredServices.map(service => (
            <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-info">{service.category}</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-mono)' }}>
                  ₹{service.price.toLocaleString('en-IN')}
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{service.name}</h3>
              <p style={{ fontSize: '0.875rem', flex: 1, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {service.description}
              </p>

              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} />
                  <span>{service.durationMinutes} minutes duration</span>
                </div>
                {service.provider && (
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {service.provider.fullName}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleBookClick(service)}
                style={{ width: '100%' }}
              >
                <Calendar size={15} />
                <span>Schedule Consultation</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        preselectedService={preselectedService}
        pets={pets}
        onClose={() => { setIsBookModalOpen(false); setPreselectedService(null); }}
        onBooked={() => {
          alert('Appointment booked successfully! You can track it in your dashboard.');
          setCurrentView('dashboard');
        }}
      />
    </div>
  );
}
