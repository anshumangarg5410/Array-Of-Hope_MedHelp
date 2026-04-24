const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MongoDB URI not provided. Skipping database connection for now.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
