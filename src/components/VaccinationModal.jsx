import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Syringe } from 'lucide-react';
import { api } from '../api';

export default function VaccinationModal({ pet, isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    vaccineName: 'Rabies (3-Year Imrab)',
    administeredDate: new Date().toISOString().slice(0, 10),
    nextDueDate: '',
    batchNumber: 'VAC-' + Math.floor(100000 + Math.random() * 900000),
    clinicNotes: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.vaccineName.trim()) {
      setError('Vaccine name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.vaccinations.create({
        petId: pet.id,
        vaccineName: formData.vaccineName,
        administeredDate: formData.administeredDate,
        nextDueDate: formData.nextDueDate || null,
        batchNumber: formData.batchNumber,
        clinicNotes: formData.clinicNotes,
      });

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record immunization');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-box" style={{ width: '2.2rem', height: '2.2rem' }}>
              <Syringe size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Certificate of Immunization
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Patient: <strong>{pet.name}</strong> ({pet.species})
              </div>
            </div>
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

            <div className="form-group">
              <label className="form-label">Vaccine / Antigen Formulation *</label>
              <select
                className="form-select"
                value={formData.vaccineName}
                onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                required
                id="vac-name-select"
              >
                <option value="Rabies (1-Year Core)">Rabies (1-Year Core Standard)</option>
                <option value="Rabies (3-Year Imrab)">Rabies (3-Year Imrab Booster)</option>
                <option value="DHPP / DAPP (Canine Distemper, Adenovirus, Parvovirus, Parainfluenza)">DHPP / DAPP (Canine 5-in-1 Core)</option>
                <option value="Bordetella Bronchiseptica (Kennel Cough)">Bordetella Bronchiseptica (Kennel Cough)</option>
                <option value="Leptospirosis 4-Way">Leptospirosis 4-Way Vaccine</option>
                <option value="Lyme Disease (Borrelia Burgdorferi)">Lyme Disease Antigen</option>
                <option value="FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)">FVRCP (Feline 3-in-1 Core)</option>
                <option value="FeLV (Feline Leukemia Virus)">FeLV (Feline Leukemia Virus)</option>
              </select>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Date Administered *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.administeredDate}
                  onChange={(e) => setFormData({ ...formData, administeredDate: e.target.value })}
                  required
                  id="vac-admin-date"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Booster Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  id="vac-due-date"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Manufacturer Batch / Lot Serial #</label>
              <input
                type="text"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                id="vac-batch-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Veterinary Administration Notes</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Subcutaneous injection in right hind limb. No adverse reaction observed post 15m."
                value={formData.clinicNotes}
                onChange={(e) => setFormData({ ...formData, clinicNotes: e.target.value })}
                id="vac-notes-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} id="btn-save-vaccination">
              {isSubmitting ? 'Certifying...' : 'Issue Vaccine Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
