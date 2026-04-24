export const featureCards = [
  {
    title: "Upload Prescription",
    description: "Scan handwritten or printed prescriptions with a mock OCR workflow and extract medicines instantly.",
    badge: "OCR-ready",
  },
  {
    title: "Drug Interaction Checker",
    description: "Surface severe, moderate, and safe combinations with simple microcopy patients can understand.",
    badge: "Safety-first",
  },
  {
    title: "AI Health Assistant",
    description: "Offer symptom-aware guidance and education with a conversational assistant available all day.",
    badge: "24x7 support",
  },
  {
    title: "Doctor Chat",
    description: "Keep care teams and patients aligned with clean async messaging and action-oriented follow-ups.",
    badge: "Collaborative",
  },
  {
    title: "Medical History",
    description: "Track prescription changes, trends, and prior interactions in a chronological health timeline.",
    badge: "Longitudinal",
  },
];

export const patientStats = [
  { label: "Active prescriptions", value: "12" },
  { label: "Flagged combinations", value: "3" },
  { label: "Doctor responses", value: "7" },
  { label: "Weekly wellness score", value: "84%" },
];

export const doctorStats = [
  { label: "Patients monitored", value: "48" },
  { label: "High-risk alerts", value: "6" },
  { label: "Unread messages", value: "14" },
  { label: "Reviewed prescriptions", value: "26" },
];

export const extractedMedicines = [
  { name: "Warfarin", dose: "5mg", schedule: "Once daily" },
  { name: "Ibuprofen", dose: "400mg", schedule: "Twice daily after meals" },
  { name: "Amoxicillin", dose: "500mg", schedule: "Three times daily" },
];

export const interactions = [
  {
    id: 1,
    severity: "Severe",
    drugs: ["Warfarin", "Ibuprofen"],
    message: "This combination may increase bleeding risk.",
    action: "Consult your doctor before taking both medicines together.",
  },
  {
    id: 2,
    severity: "Moderate",
    drugs: ["Amoxicillin", "Warfarin"],
    message: "Monitor closely as antibiotic therapy may affect INR response.",
    action: "Schedule a follow-up test if symptoms change or bruising appears.",
  },
  {
    id: 3,
    severity: "Safe",
    drugs: ["Amoxicillin", "Ibuprofen"],
    message: "No major interaction is expected with standard short-term use.",
    action: "Continue as prescribed and stay hydrated.",
  },
];

export const aiSeedMessages = [
  {
    id: 1,
    sender: "assistant",
    text: "Hello! I can help explain symptoms, medication timing, and what your interaction report means.",
    time: "09:00 AM",
  },
];

export const doctorSeedMessages = [
  {
    id: 1,
    sender: "doctor",
    text: "Your recent upload has been reviewed. Please avoid taking pain medication before we confirm the dosage.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "patient",
    text: "Understood. Is acetaminophen okay instead?",
    time: "10:34 AM",
  },
];

export const patientPortalMessages = [
  {
    id: 1,
    sender: "doctor",
    text: "Hello from MedHelp care. I reviewed your latest medicines and left a note about the severe interaction.",
    time: "09:50 AM",
  },
  {
    id: 2,
    sender: "patient",
    text: "Thank you. I want to add my older prescription and confirm what I should continue.",
    time: "09:54 AM",
  },
];

export const historyTimeline = [
  {
    id: 1,
    title: "Prescription uploaded",
    subtitle: "Cardiology consult",
    date: "April 21, 2026",
    body: "Prescription scan added with Warfarin, Metoprolol, and Ibuprofen listed for post-procedure recovery.",
  },
  {
    id: 2,
    title: "Interaction flagged",
    subtitle: "Bleeding risk warning",
    date: "April 22, 2026",
    body: "Warfarin and Ibuprofen marked severe with a recommendation to speak with a doctor immediately.",
  },
  {
    id: 3,
    title: "Doctor follow-up",
    subtitle: "Medication adjusted",
    date: "April 23, 2026",
    body: "Pain relief was changed and a follow-up INR check was suggested for the next 48 hours.",
  },
];

export const personalizationSuggestions = {
  kids: {
    women: [
      "Use child-safe formulations and double-check syrup strengths before every dose.",
      "Track fever timing, hydration, and appetite changes together for easier pediatric review.",
    ],
    men: [
      "Always confirm pediatric doses by weight rather than age alone.",
      "Keep a simple symptom journal when multiple cold or cough medicines are involved.",
    ],
  },
  adults: {
    women: [
      "Review interaction risks before starting pain relievers during menstrual discomfort.",
      "Hormonal health notes can change how symptom trends are interpreted over time.",
    ],
    men: [
      "Space new medications and track side effects during the first 72 hours.",
      "Combine prescription review with blood pressure and sleep pattern notes for better context.",
    ],
  },
  geriatric: {
    women: [
      "Simplify schedules using morning-evening routines to reduce missed or duplicate doses.",
      "Watch closely for dizziness, appetite loss, and hydration changes when adding new medicines.",
    ],
    men: [
      "Use one updated medication list across all specialists to lower duplicate therapy risk.",
      "Ask for renal-friendly alternatives when fatigue or swelling becomes more noticeable.",
    ],
  },
};

export const patientList = [
  { id: "p-1", name: "Aarav Sharma", condition: "Atrial fibrillation", risk: "High", age: 61 },
  { id: "p-2", name: "Meera Kapoor", condition: "Type 2 diabetes", risk: "Moderate", age: 45 },
  { id: "p-3", name: "Rohan Iyer", condition: "Pediatric asthma", risk: "Low", age: 11 },
  { id: "p-4", name: "Nisha Verma", condition: "Post-op recovery", risk: "High", age: 33 },
];

export const doctorPatientDetails = {
  "p-1": {
    vitals: ["BP 132/86", "Pulse 72", "INR pending"],
    notes: "Needs immediate NSAID review due to anticoagulant therapy.",
  },
  "p-2": {
    vitals: ["Glucose 142", "BP 126/80", "A1C follow-up due"],
    notes: "Current combination is stable. Monitor diet and energy levels.",
  },
  "p-3": {
    vitals: ["Peak flow fair", "SpO2 98%", "Weight-adjusted dosing"],
    notes: "Family requested an easier medication schedule chart.",
  },
  "p-4": {
    vitals: ["Temp 98.4F", "Pulse 84", "Pain level 5/10"],
    notes: "Potential duplicate pain medication documented in uploaded prescription.",
  },
};

export const defaultHealthProfile = {
  age: 29,
  pastDiseases: ["Migraine", "Seasonal allergies"],
  ongoingMedicines: ["Warfarin 5mg", "Vitamin D weekly", "Metoprolol 25mg"],
  pastPrescriptions: [
    {
      id: 1,
      title: "Cardiology review",
      date: "April 21, 2026",
      items: ["Warfarin 5mg", "Metoprolol 25mg", "Ibuprofen 400mg"],
    },
    {
      id: 2,
      title: "General physician follow-up",
      date: "March 11, 2026",
      items: ["Amoxicillin 500mg", "Paracetamol 650mg"],
    },
  ],
};
