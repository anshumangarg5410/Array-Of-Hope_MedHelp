const mongoose = require('mongoose');

// Using strict: false so it can display all fields in your database without needing to pre-define the schema,
// since I don't have the exact screenshot of the fields.
const doctorSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Doctor', doctorSchema, 'doctors');
