import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Clock, Stethoscope, Scissors } from 'lucide-react';
import { api } from '../api';

export default function BookAppointmentModal({ isOpen, onClose, onBooked, preselectedService = null, pets = [] }) {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      loadServicesAndProviders();
      if (pets && pets.length > 0 && !selectedPetId) {
        setSelectedPetId(pets[0].id);
      }
      if (preselectedService) {
        setSelectedServiceId(preselectedService.id);
        if (preselectedService.provider) {
          setSelectedProviderId(preselectedService.provider.id);
        }
      }
      // Set default appointment date to tomorrow 10:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const isoLocal = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setAppointmentDate(isoLocal);
    }
  }, [isOpen, preselectedService, pets]);

  const loadServicesAndProviders = async () => {
    try {
      const [serviceList, providerList] = await Promise.all([
        api.services.getAll(),
        api.providers.getAll(),
      ]);
      setServices(serviceList || []);
      setProviders(providerList || []);

      if (serviceList && serviceList.length > 0 && !selectedServiceId) {
        setSelectedServiceId(serviceList[0].id);
        if (serviceList[0].provider) {
          setSelectedProviderId(serviceList[0].provider.id);
        } else if (providerList && providerList.length > 0) {
          setSelectedProviderId(providerList[0].id);
        }
      }
    } catch (err) {
      setError('Could not load services and doctors: ' + err.message);
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedServiceId(serviceId);
    const foundService = services.find(s => String(s.id) === String(serviceId));
    if (foundService?.provider) {
      setSelectedProviderId(foundService.provider.id);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedPetId) {
      setError('Please select a pet patient. If you have no registered pets, please add one first.');
      return;
    }
    if (!selectedServiceId) {
      setError('Please select a care service');
      return;
    }
    if (!selectedProviderId) {
      setError('Please select a healthcare provider / doctor');
      return;
    }
    if (!appointmentDate) {
      setError('Please pick an appointment date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.appointments.create({
        petId: Number(selectedPetId),
        serviceId: Number(selectedServiceId),
        providerId: Number(selectedProviderId),
        appointmentDate,
        notes,
      });

      onBooked();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeService = services.find(s => String(s.id) === String(selectedServiceId));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-box" style={{ width: '2.2rem', height: '2.2rem' }}>
              <Calendar size={16} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Schedule Clinical &amp; Care Appointment
            </h3>
          </div>
          <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {pets.length === 0 ? (
              <div style={{
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--status-warning-bg)',
                color: 'var(--status-warning-text)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem'
              }}>
                <strong>No Pet Profiles Found!</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                  You must register at least one pet before booking a consultation or grooming service.
                </p>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Select Patient (Your Pet) *</label>
                <select
                  className="form-select"
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  required
                  id="appointment-pet-select"
                >
                  <option value="">-- Choose Pet Patient --</option>
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} &bull; {p.breed || 'Standard'} &bull; {p.gender})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Care Service *</label>
                <select
                  className="form-select"
                  value={selectedServiceId}
                  onChange={handleServiceChange}
                  required
                  id="appointment-service-select"
                >
                  <option value="">-- Select Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      [{s.category}] {s.name} - ₹{s.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Care Specialist / Provider *</label>
                <select
                  className="form-select"
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  required
                  id="appointment-provider-select"
                >
                  <option value="">-- Select Specialist --</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.role === 'ROLE_VETERINARIAN' ? 'Doctor / Vet' : 'Care Provider'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeService && (
              <div style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ color: 'var(--primary-600)' }}>{activeService.name}</strong>
                  <span className="badge badge-info">{activeService.durationMinutes} mins &bull; ₹{activeService.price.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{activeService.description}</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Appointment Date &amp; Time *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                id="appointment-date-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Symptoms / Consultation Reason / Special Instructions</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe current symptoms, behavioral changes, or special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                id="appointment-notes-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting || pets.length === 0}
              id="btn-confirm-appointment"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
