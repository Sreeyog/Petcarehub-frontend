import React, { useState, useEffect } from 'react';
import { X, PawPrint, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function PetModal({ pet, isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    dateOfBirth: '',
    gender: 'Male',
    weightKg: '',
    color: '',
    microchipNumber: '',
    allergies: '',
    specialNotes: '',
    photoUrl: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        dateOfBirth: pet.dateOfBirth || '',
        gender: pet.gender || 'Male',
        weightKg: pet.weightKg !== null && pet.weightKg !== undefined ? String(pet.weightKg) : '',
        color: pet.color || '',
        microchipNumber: pet.microchipNumber || '',
        allergies: pet.allergies || '',
        specialNotes: pet.specialNotes || '',
        photoUrl: pet.photoUrl || '',
      });
    } else {
      setFormData({
        name: '',
        species: 'Dog',
        breed: '',
        dateOfBirth: '',
        gender: 'Male',
        weightKg: '',
        color: '',
        microchipNumber: '',
        allergies: '',
        specialNotes: '',
        photoUrl: '',
      });
    }
    setError('');
  }, [pet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Pet name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
      };

      if (pet?.id) {
        await api.pets.update(pet.id, payload);
      } else {
        await api.pets.create(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save pet profile');
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
              <PawPrint size={16} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {pet ? `Edit Patient Profile: ${pet.name}` : 'Register New Pet Patient'}
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

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Pet Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bella, Max"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  id="pet-name-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Species *</label>
                <select
                  className="form-select"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  id="pet-species-select"
                >
                  <option value="Dog">Dog (Canine)</option>
                  <option value="Cat">Cat (Feline)</option>
                  <option value="Bird">Bird (Avian)</option>
                  <option value="Rabbit">Rabbit (Lagomorph)</option>
                  <option value="Hamster">Hamster / Small Mammal</option>
                  <option value="Reptile">Reptile</option>
                  <option value="Other">Other Species</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Breed</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Golden Retriever, Siamese"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  id="pet-breed-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  id="pet-gender-select"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Neutered Male">Neutered Male</option>
                  <option value="Spayed Female">Spayed Female</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  id="pet-dob-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="form-input"
                  placeholder="e.g. 14.5"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  id="pet-weight-input"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Microchip ID (ISO 11784/11785)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 985141001234567"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  value={formData.microchipNumber}
                  onChange={(e) => setFormData({ ...formData, microchipNumber: e.target.value })}
                  id="pet-microchip-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Coat Color / Markings</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Golden Cream, Tricolor"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  id="pet-color-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies / Sensitivities</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Penicillin, Chicken protein, Bee stings, None known"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                id="pet-allergies-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical & Care Notes</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Special dietary guidelines, behavior traits, previous surgeries..."
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                id="pet-notes-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo URL (Optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                id="pet-photo-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} id="btn-save-pet">
              {isSubmitting ? 'Saving...' : (pet ? 'Update Patient' : 'Save Patient Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
