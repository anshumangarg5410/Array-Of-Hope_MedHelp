const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  ageCategory: { type: String },
  sex: { type: String },
  phone: { type: String },
  bloodGroup: { type: String },
  
  // Medical Data
  allergies: [{ type: String }],
  currentDiseases: [{ type: String }],
  currentMedications: [{ type: String }],
  
  prescriptions: [{ type: mongoose.Schema.Types.Mixed }],
  uploadedPrescriptions: [{ type: mongoose.Schema.Types.Mixed }],
  aiHistory: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

// Auto-generate ageCategory from age
userSchema.pre('save', function(next) {
  if (this.age) {
    if (this.age < 18) {
      this.ageCategory = 'Pediatric';
    } else if (this.age >= 18 && this.age <= 60) {
      this.ageCategory = 'Adult';
    } else if (this.age > 60) {
      this.ageCategory = 'Geriatric';
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
