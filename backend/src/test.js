require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const newUser = new User({
      name: "Test User",
      email: "test2@test.com",
      password: hashedPassword,
      age: 30,
      sex: "Male",
      phone: "1234567890",
      bloodGroup: "O+",
      allergies: ["Peanuts"],
      currentDiseases: ["Hypertension"],
      currentMedications: ["Whey"]
    });
    await newUser.save();
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err);
  }
  process.exit();
}
test();
