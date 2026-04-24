require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const fs = require('fs');
const path = require('path');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding...');
    
    const dataPath = path.join(__dirname, 'example_patient.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    // Check if the user already exists to avoid duplicates
    const existing = await Patient.findOne({ email: data.email });
    if (!existing) {
      await Patient.create(data);
      console.log('Demo patient added to database successfully!');
    } else {
      console.log('Demo patient already exists in the database. Updating...');
      await Patient.findOneAndUpdate({ email: data.email }, data);
      console.log('Demo patient updated!');
    }
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
