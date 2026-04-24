export const storageKeys = {
  session: "medhelp_session",
  theme: "medhelp_theme",
  token: "medhelp_token",
  userId: "medhelp_userId",
  upload: "medhelp_upload",
  aiChat: "medhelp_ai_chat",
  doctorChat: "medhelp_doctor_chat",
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
