export const storageKeys = {
  session: "mic-session",
  theme: "mic-theme",
  upload: "mic-upload",
  aiChat: "mic-ai-chat",
  doctorChat: "mic-doctor-chat",
  patientPortalChat: "mic-patient-portal-chat",
  healthProfile: "mic-health-profile",
};

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Intentionally ignore localStorage quota issues in this mock frontend.
  }
}
