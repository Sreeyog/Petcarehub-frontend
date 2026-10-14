// In development on localhost, default to local port 8080.
// On Netlify/production, default directly to your live Render backend URL.
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const defaultApiUrl = isLocal 
  ? 'http://localhost:8080/api' 
  : 'https://petcarehub-backend-1kzi.onrender.com/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('petcarehub_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || (data?.errors ? Object.values(data.errors).join(', ') : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    getMe: () => request('/auth/me'),
  },

  pets: {
    getAll: () => request('/pets'),
    getMy: () => request('/pets/my'),
    getById: (id) => request(`/pets/${id}`),
    create: (petData) => request('/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
    }),
    update: (id, petData) => request(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    }),
    delete: (id) => request(`/pets/${id}`, {
      method: 'DELETE',
    }),
  },

  appointments: {
    getAll: () => request('/appointments'),
    getByPet: (petId) => request(`/appointments/pet/${petId}`),
    getById: (id) => request(`/appointments/${id}`),
    create: (appointmentData) => request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
    updateStatus: (id, status, providerNotes = '') => request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, providerNotes }),
    }),
  },

  medicalRecords: {
    getAll: () => request('/medical-records'),
    getByPet: (petId) => request(`/medical-records/pet/${petId}`),
    getById: (id) => request(`/medical-records/${id}`),
    create: (recordData) => request('/medical-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    }),
  },

  vaccinations: {
    getByPet: (petId) => request(`/vaccinations/pet/${petId}`),
    getUpcoming: () => request('/vaccinations/upcoming'),
    create: (vaccinationData) => request('/vaccinations', {
      method: 'POST',
      body: JSON.stringify(vaccinationData),
    }),
  },

  services: {
    getAll: () => request('/services'),
    getByCategory: (category) => request(`/services/category/${category}`),
    getById: (id) => request(`/services/${id}`),
    create: (serviceData) => request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }),
    update: (id, serviceData) => request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }),
    delete: (id) => request(`/services/${id}`, {
      method: 'DELETE',
    }),
  },

  providers: {
    getAll: () => request('/providers'),
  },

  admin: {
    getStats: () => request('/dashboard/stats'),
    getUsers: () => request('/admin/users'),
    updateUserRole: (id, role) => request(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
    toggleUserStatus: (id) => request(`/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
    }),
  },
};
