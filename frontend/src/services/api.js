import { readStorage, storageKeys } from "../utils/storage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const getHeaders = () => {
  const token = readStorage(storageKeys.token, null);
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // ---------------- AUTH ---------------- //
  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to register");
    }
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to login");
    }
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to logout");
    }
    return response.json();
  },

  // ---------------- PRESCRIPTION ---------------- //
  checkPrescription: async (patientId) => {
    const response = await fetch(`${API_BASE}/prescription/check`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ patientId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to check prescription");
    }
    return response.json();
  },

  // ---------------- PROFILE ---------------- //
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/patients/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch profile");
    }
    return response.json();
  },

  addPrescription: async (data) => {
    const response = await fetch(`${API_BASE}/patients/me/prescriptions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add prescription");
    }
    return response.json();
  },

  // ---------------- CHAT ---------------- //
  sendChatMessage: async (patientId, message) => {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ patientId, message }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send message to AI");
    }
    return response.json();
  },
};
