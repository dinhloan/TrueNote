const dns = require("dns");
const mongoose = require("mongoose");

// Fix lỗi querySrv ECONNREFUSED khi Node không resolve được MongoDB Atlas SRV record
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("Missing MONGODB_URI in .env file");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000,
    });

    console.log("✅ MongoDB Atlas connected");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
