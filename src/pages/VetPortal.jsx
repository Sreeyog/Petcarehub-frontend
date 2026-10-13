import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  Syringe, 
  CheckCircle2, 
  Clock, 
  Activity, 
  User, 
  Search,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import MedicalRecordModal from '../components/MedicalRecordModal';
import VaccinationModal from '../components/VaccinationModal';

export default function VetPortal() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPetForRecord, setSelectedPetForRecord] = useState(null);
  const [selectedPetForVac, setSelectedPetForVac] = useState(null);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isVacModalOpen, setIsVacModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVetData();
  }, []);

  const loadVetData = async () => {
    setIsLoading(true);
    try {
      const [appts, pets, recs] = await Promise.all([
        api.appointments.getAll(),
        api.pets.getAll(),
        api.medicalRecords.getAll(),
      ]);
      setAppointments(appts || []);
      setAllPets(pets || []);
      setMedicalRecords(recs || []);
    } catch (err) {
      console.error('Error loading vet data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await api.appointments.updateStatus(apptId, newStatus, `Updated to ${newStatus} by ${user?.fullName}`);
      loadVetData();
    } catch (err) {
      alert('Could not update appointment status: ' + err.message);
    }
  };

  const openMedicalModalForPet = (pet) => {
    setSelectedPetForRecord(pet);
    setIsMedModalOpen(true);
  };

  const openVaccineModalForPet = (pet) => {
    setSelectedPetForVac(pet);
    setIsVacModalOpen(true);
  };

  const filteredPets = allPets.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.owner?.fullName && p.owner.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.species && p.species.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.microchipNumber && p.microchipNumber.includes(searchQuery))
  );

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
          <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>Clinical Doctor Workstation</span>
          <h1 style={{ fontSize: '1.85rem' }}>{user?.fullName}</h1>
          <p style={{ fontSize: '0.9rem' }}>
            {user?.clinicOrBusinessName || 'Apex Veterinary Hospital'} &bull; {user?.specialization || 'Clinical Veterinary Medicine'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={loadVetData}
          >
            Refresh Workstation
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-val">{appointments.length}</div>
            <div className="stat-label">Assigned Consultations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#92400e' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-val">
              {appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS').length}
            </div>
            <div className="stat-label">Pending / Active Patients</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-val">{medicalRecords.length}</div>
            <div className="stat-label">Diagnostic Charts Logged</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: CONSULTATION APPOINTMENTS QUEUE */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Clock size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Consultation Schedule &amp; Clinical Pipeline</span>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Calendar size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No patient appointments currently queued for your review.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Patient Pet</th>
                  <th>Owner Contact</th>
                  <th>Service Requested</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                  <th>Owner Notes</th>
                  <th>Clinical Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{appt.pet?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {appt.pet?.species} &bull; {appt.pet?.breed || 'Standard'} &bull; {appt.pet?.gender}
                      </div>
                    </td>
                    <td>
                      <div>{appt.owner?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.owner?.phone || appt.owner?.email}</div>
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
                      {appt.status === 'IN_PROGRESS' && <span className="badge badge-info">In Examination</span>}
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
                            title="Confirm Consultation"
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
                              title="Begin Examination"
                            >
                              Start Exam
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{ backgroundColor: '#059669', color: '#ffffff' }}
                              onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                              title="Directly Mark Consultation Complete"
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
                            title="Mark Consultation Complete"
                          >
                            Complete
                          </button>
                        )}

                        {/* Quick Action: Log EMR */}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openMedicalModalForPet(appt.pet)}
                          title="Write Diagnostic Record"
                        >
                          <FileText size={13} />
                          <span>EMR</span>
                        </button>

                        {/* Quick Action: Log Vaccine */}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVaccineModalForPet(appt.pet)}
                          title="Certify Vaccine"
                        >
                          <Syringe size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: PATIENT HEALTH RECORDS SEARCH & DIRECTORY */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Stethoscope size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Master Patient Directory &amp; Health Trajectories ({allPets.length})</span>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by pet name, chip #, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {allPets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No patients registered in the hospital database yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Species &amp; Breed</th>
                  <th>Age / Weight</th>
                  <th>Microchip ID</th>
                  <th>Owner Name</th>
                  <th>Allergies &amp; Alerts</th>
                  <th>Clinical Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.map(pet => (
                  <tr key={pet.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="brand-icon-box" style={{ width: '2rem', height: '2rem', flexShrink: 0 }}>
                          <Stethoscope size={14} />
                        </div>
                        <div>
                          <strong>{pet.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pet.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {pet.species} &bull; {pet.breed || 'Standard'}
                    </td>
                    <td>
                      {pet.dateOfBirth || 'Unknown DOB'}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {pet.weightKg ? `${pet.weightKg} kg` : '-'}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {pet.microchipNumber || <span style={{ color: 'var(--text-muted)' }}>Unchipped</span>}
                    </td>
                    <td>
                      <div>{pet.owner?.fullName || 'Client'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pet.owner?.phone}</div>
                    </td>
                    <td>
                      {pet.allergies ? (
                        <span className="badge badge-danger">{pet.allergies}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No known allergies</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openMedicalModalForPet(pet)}
                        >
                          <FileText size={13} />
                          <span>Record Exam</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVaccineModalForPet(pet)}
                          title="Certify Vaccination"
                        >
                          <Syringe size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 3: RECENT DIAGNOSTIC LOGS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileText size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Recent Clinical Diagnostic Records Logged</span>
          </div>
        </div>

        {medicalRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No clinical diagnostic records entered yet. Click "Record Exam" on any patient above to create one.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Primary Diagnosis</th>
                  <th>Clinical Symptoms</th>
                  <th>Treatment Regimen</th>
                  <th>Prescribed Rx</th>
                  <th>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map(rec => (
                  <tr key={rec.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{rec.recordDate}</td>
                    <td>
                      <strong>{rec.pet?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.pet?.species}</div>
                    </td>
                    <td><strong style={{ color: 'var(--primary-700)' }}>{rec.diagnosis}</strong></td>
                    <td style={{ fontSize: '0.825rem', maxWidth: '200px' }}>{rec.symptoms || '-'}</td>
                    <td style={{ fontSize: '0.825rem', maxWidth: '200px' }}>{rec.treatmentPlan || '-'}</td>
                    <td style={{ fontSize: '0.825rem', color: '#0369a1' }}>{rec.prescribedMedications || '-'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {rec.nextFollowUpDate || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <MedicalRecordModal
        pet={selectedPetForRecord}
        isOpen={isMedModalOpen}
        onClose={() => { setIsMedModalOpen(false); setSelectedPetForRecord(null); }}
        onSaved={loadVetData}
      />

      <VaccinationModal
        pet={selectedPetForVac}
        isOpen={isVacModalOpen}
        onClose={() => { setIsVacModalOpen(false); setSelectedPetForVac(null); }}
        onSaved={loadVetData}
      />
    </div>
  );
}
