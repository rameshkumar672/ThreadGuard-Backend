// const mongoose = require("mongoose");
// require("dotenv").config(); // Ensure env loads if called by independent models

// const options = {
//   ssl: true,
//   tlsAllowInvalidCertificates: true,
//   serverSelectionTimeoutMS: 5000,
// };

// const tgConnection = mongoose.createConnection(process.env.MONGO_URI, {
//   ...options,
//   dbName: "threatguard"
// });

// const slConnection = mongoose.createConnection(process.env.MONGO_URI, {
//   ...options,
//   dbName: "smartlogin"
// });

// tgConnection.on("connected", () => console.log("✅ ThreatGuard Database Connected"));
// slConnection.on("connected", () => console.log("✅ SmartLogin Database Connected"));

// tgConnection.on("error", (err) => console.error("❌ ThreatGuard Connection Error:", err.message));
// slConnection.on("error", (err) => console.error("❌ SmartLogin Connection Error:", err.message));

// module.exports = { tgConnection, slConnection };

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const options = {
      ssl: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 5000
    };

    const tgConnection = mongoose.createConnection(
      process.env.MONGODB_URI,
      {
        ...options,
        dbName: "threatguard"
      }
    );

    const slConnection = mongoose.createConnection(
      process.env.MONGODB_URI,
      {
        ...options,
        dbName: "smartlogin"
      }
    );

    tgConnection.on("connected", () =>
      console.log("✅ ThreatGuard Database Connected")
    );

    slConnection.on("connected", () =>
      console.log("✅ SmartLogin Database Connected")
    );

    tgConnection.on("error", (err) =>
      console.error(
        "❌ ThreatGuard Connection Error:",
        err.message
      )
    );

    slConnection.on("error", (err) =>
      console.error(
        "❌ SmartLogin Connection Error:",
        err.message
      )
    );

    return {
      tgConnection,
      slConnection
    };
  } catch (error) {
    console.error("Database Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;