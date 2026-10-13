import React, { useState } from 'react';
import { X, FileText, AlertCircle, Stethoscope, Pill, HeartPulse } from 'lucide-react';
import { api } from '../api';

export default function MedicalRecordModal({ pet, isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    vitalSigns: 'Temp: 38.5°C | HR: 110 bpm | RR: 24 bpm',
    treatmentPlan: '',
    prescribedMedications: '',
    nextFollowUpDate: '',
    labResultsSummary: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.diagnosis.trim()) {
      setError('Diagnosis is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.medicalRecords.create({
        petId: pet.id,
        diagnosis: formData.diagnosis,
        symptoms: formData.symptoms,
        vitalSigns: formData.vitalSigns,
        treatmentPlan: formData.treatmentPlan,
        prescribedMedications: formData.prescribedMedications,
        nextFollowUpDate: formData.nextFollowUpDate || null,
        labResultsSummary: formData.labResultsSummary,
      });

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record medical consultation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-box" style={{ width: '2.2rem', height: '2.2rem' }}>
              <Stethoscope size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Clinical Diagnostic Record
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Patient: <strong>{pet.name}</strong> ({pet.species} &bull; {pet.breed || 'Standard'}) &bull; Owner: {pet.owner?.fullName || 'Client'}
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
              <label className="form-label">Primary Diagnosis *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Acute Canine Otitis Externa, Feline Upper Respiratory Infection"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                required
                id="med-diagnosis-input"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Clinical Symptoms &amp; Onset</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Head shaking, scratching right ear, erythema..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  id="med-symptoms-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vital Signs Telemetry</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  value={formData.vitalSigns}
                  onChange={(e) => setFormData({ ...formData, vitalSigns: e.target.value })}
                  placeholder="Temp: 38.5°C | HR: 110 bpm | RR: 24 bpm"
                  id="med-vitals-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Treatment Plan &amp; Procedures</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Deep otoscopic flush, topical antiseptic cleaning, keep ear dry..."
                value={formData.treatmentPlan}
                onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                id="med-treatment-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prescribed Medications &amp; Dosages</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Posatex Otic Drops 4 drops once daily for 10 days; Rimadyl 25mg BID PRN"
                value={formData.prescribedMedications}
                onChange={(e) => setFormData({ ...formData, prescribedMedications: e.target.value })}
                id="med-rx-input"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Laboratory / Diagnostic Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Cytology showed moderate Malassezia yeast organisms"
                  value={formData.labResultsSummary}
                  onChange={(e) => setFormData({ ...formData, labResultsSummary: e.target.value })}
                  id="med-lab-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Follow-up Evaluation Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.nextFollowUpDate}
                  onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                  id="med-followup-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} id="btn-save-med-record">
              {isSubmitting ? 'Recording...' : 'Commit Medical Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
