const mongoose = require('mongoose');

/**
 * Attempt to connect to MongoDB.
 * Returns true on success, false on failure (no process.exit).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✔  MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`✖  MongoDB unavailable: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
