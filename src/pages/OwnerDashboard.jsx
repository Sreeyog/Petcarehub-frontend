import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  PawPrint, 
  Calendar, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  Syringe,
  Activity
} from 'lucide-react';
import PetModal from '../components/PetModal';
import BookAppointmentModal from '../components/BookAppointmentModal';
import VaccinationModal from '../components/VaccinationModal';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isVacModalOpen, setIsVacModalOpen] = useState(false);
  const [vacPet, setVacPet] = useState(null);

  // Selected pet for viewing medical records
  const [selectedPetRecords, setSelectedPetRecords] = useState(null);
  const [recordsList, setRecordsList] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [petsData, apptsData] = await Promise.all([
        api.pets.getMy(),
        api.appointments.getAll(),
      ]);
      setPets(petsData || []);
      setAppointments(apptsData || []);

      // If user has pets, load their vaccinations
      if (petsData && petsData.length > 0) {
        const vacPromises = petsData.map(p => api.vaccinations.getByPet(p.id));
        const allVacs = await Promise.all(vacPromises);
        setVaccinations(allVacs.flat());
      } else {
        setVaccinations([]);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditPet = (pet) => {
    setEditingPet(pet);
    setIsPetModalOpen(true);
  };

  const handleDeletePet = async (petId, petName) => {
    if (window.confirm(`Are you sure you want to delete patient file for "${petName}"?`)) {
      try {
        await api.pets.delete(petId);
        loadDashboardData();
      } catch (err) {
        alert('Could not delete pet: ' + err.message);
      }
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (window.confirm('Cancel this scheduled appointment?')) {
      try {
        await api.appointments.updateStatus(apptId, 'CANCELLED', 'Cancelled by owner');
        loadDashboardData();
      } catch (err) {
        alert('Failed to cancel appointment: ' + err.message);
      }
    }
  };

  const handleViewRecords = async (pet) => {
    setSelectedPetRecords(pet);
    try {
      const recs = await api.medicalRecords.getByPet(pet.id);
      setRecordsList(recs || []);
    } catch (err) {
      console.error(err);
      setRecordsList([]);
    }
  };

  const calculateAge = (dobString) => {
    if (!dobString) return 'Age unknown';
    const dob = new Date(dobString);
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years === 0) {
      return `${months} mo`;
    }
    return `${years} yr${years > 1 ? 's' : ''}${months > 0 ? ` ${months} mo` : ''}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return <span className="badge badge-success"><CheckCircle2 size={12} /> Confirmed</span>;
      case 'IN_PROGRESS': return <span className="badge badge-info"><Activity size={12} /> In Progress</span>;
      case 'COMPLETED': return <span className="badge badge-neutral"><CheckCircle2 size={12} /> Completed</span>;
      case 'CANCELLED': return <span className="badge badge-danger"><XCircle size={12} /> Cancelled</span>;
      default: return <span className="badge badge-warning"><Clock size={12} /> Pending Review</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>Pet Owner Portal</span>
          <h1 style={{ fontSize: '1.85rem' }}>Welcome, {user?.fullName}</h1>
          <p style={{ fontSize: '0.9rem' }}>
            Manage your companion patients, monitor vaccine passports, and coordinate care consultations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setEditingPet(null); setIsPetModalOpen(true); }}
            id="btn-add-pet"
          >
            <Plus size={16} />
            <span>Register New Pet</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsBookModalOpen(true)}
            id="btn-book-appointment"
          >
            <Calendar size={16} />
            <span>Book Care Appointment</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
            <PawPrint size={22} />
          </div>
          <div>
            <div className="stat-val">{pets.length}</div>
            <div className="stat-label">Registered Pets</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-val">{appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length}</div>
            <div className="stat-label">Upcoming Visits</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="stat-val">{vaccinations.length}</div>
            <div className="stat-label">Active Vaccine Records</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: MY PETS */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-title">
            <PawPrint size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Registered Companion Patients ({pets.length})</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => { setEditingPet(null); setIsPetModalOpen(true); }}
          >
            <Plus size={14} />
            <span>Add Pet</span>
          </button>
        </div>

        {pets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div className="brand-icon-box" style={{ margin: '0 auto 1rem', width: '3.5rem', height: '3.5rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)' }}>
              <PawPrint size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Pets Registered Yet</h3>
            <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Add your dog, cat, or other companions to start logging health trajectories, vaccinations, and booking clinical appointments.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setEditingPet(null); setIsPetModalOpen(true); }}
            >
              <Plus size={16} />
              <span>Register Your First Pet</span>
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {pets.map(pet => (
              <div 
                key={pet.id} 
                className="card" 
                style={{ 
                  backgroundColor: 'var(--bg-surface-subtle)', 
                  border: '1px solid var(--border-strong)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  {pet.photoUrl ? (
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      style={{ width: '4.5rem', height: '4.5rem', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="brand-icon-box" style={{ width: '4.5rem', height: '4.5rem', flexShrink: 0, backgroundColor: 'var(--primary-600)' }}>
                      <PawPrint size={24} />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{pet.name}</h3>
                      <span className="badge badge-info">{pet.species}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {pet.breed || 'Standard'} &bull; {pet.gender}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {calculateAge(pet.dateOfBirth)} &bull; {pet.weightKg ? `${pet.weightKg} kg` : 'Weight unrecorded'}
                    </div>
                  </div>
                </div>

                {pet.allergies && (
                  <div style={{
                    backgroundColor: 'var(--status-warning-bg)',
                    color: 'var(--status-warning-text)',
                    border: '1px solid var(--status-warning-border)',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.775rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <AlertTriangle size={13} />
                    <span><strong>Allergies:</strong> {pet.allergies}</span>
                  </div>
                )}

                {pet.microchipNumber && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    Chip ID: <strong>{pet.microchipNumber}</strong>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem',
                  marginTop: 'auto',
                  flexWrap: 'wrap'
                }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleViewRecords(pet)}
                  >
                    <FileText size={13} />
                    <span>EMR History</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setVacPet(pet); setIsVacModalOpen(true); }}
                    title="Log Vaccination Certificate"
                  >
                    <Syringe size={13} />
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEditPet(pet)}
                    title="Edit Patient Info"
                  >
                    <Edit3 size={13} />
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDeletePet(pet.id, pet.name)}
                    style={{ color: '#ef4444' }}
                    title="Delete Patient Record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: APPOINTMENTS & SCHEDULE */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Calendar size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Care &amp; Clinical Appointments ({appointments.length})</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsBookModalOpen(true)}
          >
            <Plus size={14} />
            <span>Book New Appointment</span>
          </button>
        </div>

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Calendar size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No appointments booked yet. Click "Book New Appointment" to schedule an exam or care session.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Pet Patient</th>
                  <th>Service</th>
                  <th>Healthcare Provider</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                  <th>Notes / Instructions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td>
                      <strong>{appt.pet?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.pet?.species}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{appt.service?.name}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)' }}>
                        ₹{appt.service?.price?.toLocaleString('en-IN')} &bull; {appt.service?.durationMinutes} min
                      </div>
                    </td>
                    <td>
                      {appt.provider?.fullName}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {appt.provider?.clinicOrBusinessName || 'Clinic Specialist'}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {new Date(appt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td>{getStatusBadge(appt.status)}</td>
                    <td style={{ maxWidth: '240px', fontSize: '0.825rem' }}>
                      {appt.notes || <span style={{ color: 'var(--text-muted)' }}>None provided</span>}
                      {appt.providerNotes && (
                        <div style={{ color: 'var(--primary-700)', marginTop: '4px', fontStyle: 'italic' }}>
                          Provider: {appt.providerNotes}
                        </div>
                      )}
                    </td>
                    <td>
                      {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444' }}
                          onClick={() => handleCancelAppointment(appt.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 3: VACCINE PASSPORT & BOOSTER TIMELINE */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={18} style={{ color: '#059669' }} />
            <span>Digital Immunization Passports &amp; Vaccine Timeline</span>
          </div>
        </div>

        {vaccinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Syringe size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No vaccination certificates recorded yet. You or your veterinarian can log immunizations anytime.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Vaccine Antigen</th>
                  <th>Administered Date</th>
                  <th>Next Booster Due</th>
                  <th>Status</th>
                  <th>Batch / Serial #</th>
                  <th>Clinic Notes</th>
                </tr>
              </thead>
              <tbody>
                {vaccinations.map(v => (
                  <tr key={v.id}>
                    <td><strong>{v.pet?.name}</strong></td>
                    <td><span style={{ fontWeight: 600 }}>{v.vaccineName}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{v.administeredDate}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {v.nextDueDate || <span style={{ color: 'var(--text-muted)' }}>N/A</span>}
                    </td>
                    <td>
                      {v.status === 'OVERDUE' && <span className="badge badge-danger">Overdue</span>}
                      {v.status === 'DUE_SOON' && <span className="badge badge-warning">Due Soon</span>}
                      {(v.status === 'UP_TO_DATE' || v.status === 'COMPLETED') && (
                        <span className="badge badge-success">Up to Date</span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{v.batchNumber || '-'}</td>
                    <td style={{ fontSize: '0.825rem' }}>{v.clinicNotes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View EMR History */}
      {selectedPetRecords && (
        <div className="modal-backdrop" onClick={() => setSelectedPetRecords(null)}>
          <div className="modal-dialog modal-dialog-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="brand-icon-box" style={{ width: '2.2rem', height: '2.2rem' }}>
                  <FileText size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Electronic Medical Records: {selectedPetRecords.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Species: {selectedPetRecords.species} &bull; DOB: {selectedPetRecords.dateOfBirth || 'Unknown'}
                  </div>
                </div>
              </div>
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setSelectedPetRecords(null)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {recordsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <FileText size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p>No clinical diagnosis records found for {selectedPetRecords.name}.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Diagnostic records are entered by your attending veterinarian during clinic consultations.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recordsList.map(rec => (
                    <div key={rec.id} className="card" style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                          {rec.diagnosis}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Date: {rec.recordDate} &bull; Attending: {rec.veterinarian?.fullName}
                        </div>
                      </div>

                      {rec.symptoms && (
                        <div style={{ fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                          <strong>Symptoms:</strong> {rec.symptoms}
                        </div>
                      )}

                      {rec.vitalSigns && (
                        <div style={{ fontSize: '0.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          <strong>Vitals:</strong> {rec.vitalSigns}
                        </div>
                      )}

                      {rec.treatmentPlan && (
                        <div style={{ fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                          <strong>Treatment:</strong> {rec.treatmentPlan}
                        </div>
                      )}

                      {rec.prescribedMedications && (
                        <div style={{ fontSize: '0.875rem', marginBottom: '0.4rem', color: '#0369a1' }}>
                          <strong>Prescribed Rx:</strong> {rec.prescribedMedications}
                        </div>
                      )}

                      {rec.nextFollowUpDate && (
                        <div style={{ fontSize: '0.825rem', marginTop: '0.4rem', color: '#b45309' }}>
                          <strong>Scheduled Follow-up:</strong> {rec.nextFollowUpDate}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedPetRecords(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pet Registration / Edit Modal */}
      <PetModal
        pet={editingPet}
        isOpen={isPetModalOpen}
        onClose={() => { setIsPetModalOpen(false); setEditingPet(null); }}
        onSaved={loadDashboardData}
      />

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        pets={pets}
        onClose={() => setIsBookModalOpen(false)}
        onBooked={loadDashboardData}
      />

      {/* Vaccination Modal */}
      <VaccinationModal
        pet={vacPet}
        isOpen={isVacModalOpen}
        onClose={() => { setIsVacModalOpen(false); setVacPet(null); }}
        onSaved={loadDashboardData}
      />
    </div>
  );
}
