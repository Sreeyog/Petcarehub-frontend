import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  PawPrint, 
  Stethoscope, 
  Scissors, 
  Activity, 
  Lock, 
  Unlock,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData, apptsData, servsData] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
        api.appointments.getAll(),
        api.services.getAll(),
      ]);
      setStats(statsData || null);
      setUsers(usersData || []);
      setAppointments(apptsData || []);
      setServices(servsData || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.admin.updateUserRole(userId, newRole);
      loadAdminData();
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.admin.toggleUserStatus(userId);
      loadAdminData();
    } catch (err) {
      alert('Failed to update user status: ' + err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Deactivate this service from the platform catalog?')) {
      try {
        await api.services.delete(serviceId);
        loadAdminData();
      } catch (err) {
        alert('Failed to deactivate service: ' + err.message);
      }
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
          <span className="badge badge-danger" style={{ marginBottom: '0.4rem' }}>Platform Administrator Portal</span>
          <h1 style={{ fontSize: '1.85rem' }}>PetCareHub System Administration</h1>
          <p style={{ fontSize: '0.9rem' }}>
            System telemetry, user role assignment, platform appointments, and care directory control.
          </p>
        </div>

        <button type="button" className="btn btn-secondary" onClick={loadAdminData}>
          Refresh Telemetry
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalUsers || users.length}</div>
            <div className="stat-label">Registered Accounts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
            <PawPrint size={22} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalPets || 0}</div>
            <div className="stat-label">Total Pet Patients</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalAppointments || appointments.length}</div>
            <div className="stat-label">All-time Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#92400e' }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalVeterinarians || 1}</div>
            <div className="stat-label">Licensed Vets</div>
          </div>
        </div>
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Users size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Platform User Accounts &amp; Role Management ({users.length})</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>User Full Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Clinic / Specialization</th>
                <th>System Role</th>
                <th>Account Status</th>
                <th>Role Controls</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.fullName}</strong></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td style={{ fontSize: '0.825rem' }}>
                    {u.clinicOrBusinessName ? `${u.clinicOrBusinessName} (${u.specialization || 'Care'})` : '-'}
                  </td>
                  <td>
                    {u.role === 'ROLE_ADMIN' && <span className="badge badge-danger">ADMIN</span>}
                    {u.role === 'ROLE_VETERINARIAN' && <span className="badge badge-info">VET</span>}
                    {u.role === 'ROLE_SERVICE_PROVIDER' && <span className="badge badge-warning">PROVIDER</span>}
                    {u.role === 'ROLE_PET_OWNER' && <span className="badge badge-success">OWNER</span>}
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.775rem', width: 'auto' }}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="ROLE_PET_OWNER">ROLE_PET_OWNER</option>
                      <option value="ROLE_VETERINARIAN">ROLE_VETERINARIAN</option>
                      <option value="ROLE_SERVICE_PROVIDER">ROLE_SERVICE_PROVIDER</option>
                      <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALL APPOINTMENTS MASTER AUDIT */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Calendar size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Platform Appointment Master Ledger ({appointments.length})</span>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No platform appointments scheduled yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Patient Pet</th>
                  <th>Pet Owner</th>
                  <th>Healthcare Provider</th>
                  <th>Service</th>
                  <th>Appointment Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>#{a.id}</td>
                    <td><strong>{a.pet?.name}</strong> ({a.pet?.species})</td>
                    <td>{a.owner?.fullName}</td>
                    <td>{a.provider?.fullName}</td>
                    <td>{a.service?.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {new Date(a.appointmentDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SERVICE CATALOG AUDIT */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={18} style={{ color: 'var(--primary-600)' }} />
            <span>System Care Directory Configuration ({services.length})</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Provider / Hospital</th>
                <th>Deactivate</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="badge badge-info">{s.category}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₹{s.price.toLocaleString('en-IN')}</td>
                  <td>{s.durationMinutes} min</td>
                  <td>{s.provider?.fullName || 'General System Service'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                      onClick={() => handleDeleteService(s.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
