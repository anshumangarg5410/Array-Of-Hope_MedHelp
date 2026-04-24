const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  diseaseName: { type: String, required: true },
  description: { type: String },
  diagnosedDate: { type: Date },
  status: { type: String, enum: ['Ongoing', 'Cured', 'Managed'], default: 'Ongoing' },
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Moderate' },
  symptoms: [{ type: String }]
});

const currentMedicationSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date },
  prescribedBy: { type: String }
});

const prescriptionMedicationSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true }
});

const prescriptionSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medications: [prescriptionMedicationSchema],
  issuedDate: { type: Date, default: Date.now },
  validTill: { type: Date }
});

// NEW SCHEMA: AI Interaction History
const aiHistorySchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  contextUsed: {
    diseases: [{ type: String }],
    medications: [{ type: String }],
    allergies: [{ type: String }]
  },
  aiResponse: { type: String, required: true },
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
  timestamp: { type: Date, default: Date.now }
});

// NEW SCHEMA: Uploaded Prescriptions
const uploadedPrescriptionSchema = new mongoose.Schema({
  fileUrl: { type: String },
  extractedText: { type: String },
  extractedMedicines: [{ type: String }],
  uploadDate: { type: Date, default: Date.now },
  aiChecked: { type: Boolean, default: false }
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number },
  ageCategory: { type: String, enum: ['Child', 'Adult', 'Geriatric'] }, // New Field
  sex: { type: String, enum: ['Male', 'Female', 'Other'] },
  phone: { type: String },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  currentDiseases: [diseaseSchema],
  currentMedications: [currentMedicationSchema],
  prescriptions: [prescriptionSchema],
  aiHistory: [aiHistorySchema], // New Field
  uploadedPrescriptions: [uploadedPrescriptionSchema] // New Field
}, { 
  timestamps: true,
  collection: 'patient' 
});

// Pre-save hook to automatically calculate and set ageCategory based on age
patientSchema.pre('save', function() {
  if (this.age) {
    if (this.age <= 17) this.ageCategory = 'Child';
    else if (this.age <= 59) this.ageCategory = 'Adult';
    else this.ageCategory = 'Geriatric';
  }
});

module.exports = mongoose.model('Patient', patientSchema);
