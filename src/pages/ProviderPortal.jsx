import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  Scissors, 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Activity, 
  DollarSign, 
  Tag,
  AlertCircle
} from 'lucide-react';

export default function ProviderPortal() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    category: 'GROOMING',
    price: '',
    durationMinutes: 60,
    description: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, []);

  const loadProviderData = async () => {
    setIsLoading(true);
    try {
      const [appts, servs] = await Promise.all([
        api.appointments.getAll(),
        api.services.getAll(),
      ]);
      setAppointments(appts || []);
      setServices(servs || []);
    } catch (err) {
      console.error('Error loading provider data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (apptId, status) => {
    try {
      await api.appointments.updateStatus(apptId, status, `Service status updated to ${status}`);
      loadProviderData();
    } catch (err) {
      alert('Could not update appointment status: ' + err.message);
    }
  };

  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newService.name.trim() || !newService.price) {
      setError('Please provide service name and price');
      return;
    }

    try {
      await api.services.create({
        ...newService,
        price: parseFloat(newService.price),
        durationMinutes: parseInt(newService.durationMinutes, 10),
      });

      setIsAddServiceOpen(false);
      setNewService({
        name: '',
        category: 'GROOMING',
        price: '',
        durationMinutes: 60,
        description: '',
      });
      loadProviderData();
    } catch (err) {
      setError(err.message || 'Failed to add service');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>Care &amp; Grooming Workstation</span>
          <h1 style={{ fontSize: '1.85rem' }}>{user?.clinicOrBusinessName || user?.fullName}</h1>
          <p style={{ fontSize: '0.9rem' }}>
            Provider: {user?.fullName} &bull; {user?.specialization || 'Professional Pet Care & Styling'}
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setIsAddServiceOpen(true)}
        >
          <Plus size={16} />
          <span>Add New Offered Service</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#92400e' }}>
            <Scissors size={22} />
          </div>
          <div>
            <div className="stat-val">{appointments.length}</div>
            <div className="stat-label">Total Scheduled Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-val">
              {appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS').length}
            </div>
            <div className="stat-label">Active / Queue Sessions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-val">
              {appointments.filter(a => a.status === 'COMPLETED').length}
            </div>
            <div className="stat-label">Services Completed</div>
          </div>
        </div>
      </div>

      {/* APPOINTMENT QUEUE */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Calendar size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Incoming Care Appointments Queue</span>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Scissors size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No care or grooming appointments currently in queue.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Pet Patient</th>
                  <th>Owner</th>
                  <th>Service Booked</th>
                  <th>Appointment Time</th>
                  <th>Status</th>
                  <th>Special Instructions</th>
                  <th>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td>
                      <strong>{appt.pet?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {appt.pet?.species} &bull; {appt.pet?.breed || 'Standard'}
                      </div>
                    </td>
                    <td>
                      <div>{appt.owner?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.owner?.phone}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{appt.service?.name}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)' }}>
                        ₹{appt.service?.price?.toLocaleString('en-IN')} &bull; {appt.service?.durationMinutes} min
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {new Date(appt.appointmentDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td>
                      {appt.status === 'CONFIRMED' && <span className="badge badge-success">Confirmed</span>}
                      {appt.status === 'IN_PROGRESS' && <span className="badge badge-info">In Progress</span>}
                      {appt.status === 'COMPLETED' && <span className="badge badge-neutral">Completed</span>}
                      {appt.status === 'PENDING' && <span className="badge badge-warning">Pending Review</span>}
                      {appt.status === 'CANCELLED' && <span className="badge badge-danger">Cancelled</span>}
                    </td>
                    <td style={{ fontSize: '0.825rem', maxWidth: '200px' }}>
                      {appt.notes || '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {appt.status === 'PENDING' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}
                          >
                            Accept
                          </button>
                        )}
                        {appt.status === 'CONFIRMED' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleUpdateStatus(appt.id, 'IN_PROGRESS')}
                            >
                              Start Service
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{ backgroundColor: '#059669', color: '#ffffff' }}
                              onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                              title="Directly Mark Service Complete"
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {appt.status === 'IN_PROGRESS' && (
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{ backgroundColor: '#059669', color: '#ffffff' }}
                            onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                          >
                            Finish &amp; Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SERVICE CATALOG OFFERED */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Tag size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Offered Care Services Catalog ({services.length})</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsAddServiceOpen(true)}
          >
            <Plus size={14} />
            <span>New Service</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Standard Duration</th>
                <th>Description</th>
                <th>Provider / Clinic</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="badge badge-info">{s.category}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-600)' }}>
                    ₹{s.price.toLocaleString('en-IN')}
                  </td>
                  <td>{s.durationMinutes} min</td>
                  <td style={{ fontSize: '0.825rem', maxWidth: '300px' }}>{s.description}</td>
                  <td style={{ fontSize: '0.825rem' }}>{s.provider?.fullName || 'General'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {isAddServiceOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddServiceOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="brand-icon-box" style={{ width: '2.2rem', height: '2.2rem' }}>
                  <Plus size={16} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  Add Care Service to Catalog
                </h3>
              </div>
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setIsAddServiceOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit}>
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

                <div className="form-group">
                  <label className="form-label">Service Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Hydrotherapy Spa &amp; Deshedding"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    >
                      <option value="GROOMING">GROOMING</option>
                      <option value="BOARDING">BOARDING</option>
                      <option value="TRAINING">TRAINING</option>
                      <option value="VETERINARY">VETERINARY</option>
                      <option value="DENTAL">DENTAL</option>
                      <option value="WELLNESS">WELLNESS</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹ INR) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      className="form-input"
                      placeholder="e.g. 55.00"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    step="5"
                    min="15"
                    className="form-input"
                    value={newService.durationMinutes}
                    onChange={(e) => setNewService({ ...newService, durationMinutes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Description</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Detailed explanation of care procedures, materials, and benefits..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddServiceOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
