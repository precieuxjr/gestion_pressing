// src/services/parametresService.js
import { apiFetch } from './api.js';

// Profil
export const getProfil = () => apiFetch('/admin/profil');
export const updateProfil = (data) =>
  apiFetch('/admin/profil', { method: 'PUT', body: JSON.stringify(data) });
export const changePassword = (oldPassword, newPassword) =>
    apiFetch('/admin/profil/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    });

// Général
export const getGeneralSettings = () => apiFetch('/admin/settings/general');
export const updateGeneralSettings = (data) =>
  apiFetch('/admin/settings/general', { method: 'PUT', body: JSON.stringify(data) });

