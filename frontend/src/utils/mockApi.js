import { extractedMedicines, interactions } from "./mockData";

export const wait = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export async function simulatePrescriptionProcessing() {
  await wait(1600);
  return extractedMedicines;
}

export async function simulateInteractionCheck() {
  await wait(1200);
  return interactions;
}

export async function simulateAiReply(input) {
  await wait(900);

  const normalized = input.toLowerCase();

  if (normalized.includes("fever") || normalized.includes("temperature")) {
    return "If fever continues, stay hydrated, track the temperature every 4 to 6 hours, and contact a doctor if it keeps rising or is paired with breathing trouble.";
  }

  if (normalized.includes("pain") || normalized.includes("headache")) {
    return "Pain symptoms can overlap with medication side effects. Please review your current medicines before adding over-the-counter pain relief.";
  }

  if (normalized.includes("dose") || normalized.includes("dosage")) {
    return "Dose timing matters. Take each medication exactly as prescribed and check whether food or hydration guidance was included.";
  }

  return "I can help explain symptom patterns, medication timing, and what your interaction alert means. If symptoms worsen, consult a doctor.";
}
