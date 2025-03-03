import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

// ✅ Centralized Logging Function
const log = (level, message) => {
  console.log(
    `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`
  );
};

if (!MONGO_URI) {
  log("error", "❌ MONGO_URI is missing! Set it in the environment variables.");
  process.exit(1);
}

// 🚀 Adaptive Connection Pooling for Large-Scale SaaS
const connectionOptions = {
  maxPoolSize: parseInt(process.env.MONGO_MAX_POOL || "500"),
  minPoolSize: parseInt(process.env.MONGO_MIN_POOL || "50"),
  waitQueueTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 60000,
  heartbeatFrequencyMS: 10000,
  readPreference: "primaryPreferred",
  retryWrites: true,
  // autoIndex: false, // ⚠️ Disable for production performance
};

// 🛠 Adaptive Retry Logic with Exponential Backoff & Jitter
const connectToDatabase = async (maxRetries = 10, baseDelay = 5000) => {
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const dbConnection = await mongoose.connect(MONGO_URI, connectionOptions);
      log(
        "info",
        `✅ MongoDB Connected: ${dbConnection.connection.host} [DB: ${dbConnection.connection.name}]`
      );

      // 📡 Attach Connection Event Listeners
      monitorDatabaseHealth();

      return dbConnection;
    } catch (error) {
      logMongoError(error, attempt, maxRetries);

      if (attempt >= maxRetries) {
        log("error", "❌ All retry attempts failed. Exiting...");
        process.exit(1);
      }

      // ⏳ Apply Exponential Backoff with Jitter
      const jitter = Math.random() * 2000; // Random delay (0-2s)
      const nextDelay = baseDelay * Math.pow(2, attempt - 1) + jitter;
      log(
        "warn",
        `🔄 Retrying in ${(nextDelay / 1000).toFixed(2)} seconds... (${
          maxRetries - attempt
        } attempts left)`
      );

      await new Promise((res) => setTimeout(res, nextDelay));
      attempt++;
    }
  }
};

// 🛠 Connection Health Monitoring
const monitorDatabaseHealth = () => {
  const { connection } = mongoose;

  connection.on("connected", () =>
    log("info", "✅ MongoDB connection re-established.")
  );
  connection.on("disconnected", () =>
    log("warn", "⚠️ MongoDB disconnected. Attempting to reconnect...")
  );
  connection.on("reconnectFailed", () => {
    log("error", "❌ MongoDB reconnection attempts exhausted.");
    process.exit(1);
  });
  connection.on("error", (err) =>
    log("error", `❌ MongoDB Error: ${err.message}`)
  );
  connection.on("close", () => log("warn", "⚠️ MongoDB connection closed."));

  // Graceful Shutdown Handling (For Cloud & Kubernetes)
  process.on("SIGINT", async () => {
    log("warn", "⚠️ Closing MongoDB connection...");
    await mongoose.connection.close();
    log("info", "✅ MongoDB Disconnected. Exiting process.");
    process.exit(0);
  });
};

// 🛠 Categorized Error Handling for MongoDB
const logMongoError = (error, attempt, maxRetries) => {
  if (error.name === "MongoNetworkError") {
    log(
      "error",
      `🌐 Network Issue (Attempt ${attempt}/${maxRetries}): ${error.message}`
    );
  } else if (error.name === "MongoServerSelectionError") {
    log(
      "error",
      `🖥️ No MongoDB Servers Available (Attempt ${attempt}/${maxRetries}): ${error.message}`
    );
  } else if (error.name === "MongoParseError") {
    log("error", `⚠️ Invalid MongoDB Connection String: ${error.message}`);
    process.exit(1);
  } else {
    log(
      "error",
      `❌ Unknown MongoDB Error (Attempt ${attempt}/${maxRetries}): ${error.message}`
    );
  }
};

export default connectToDatabase;
