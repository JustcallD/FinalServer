import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import connectToDatabase from "./src/configs/databaseConnection.config.js";
import app from "./src/app.js";

// 🚀 Structured Logging Utility
const log = (level, message) => {
  console.log(
    `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`
  );
};

// ✅ Validate Required Environment Variables
const REQUIRED_ENV_VARS = ["PORT", "MONGO_URI"];
for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    log("error", ` Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// 🎯 Define Server Port
const port = parseInt(process.env.PORT, 10) || 4000;

let server, dbConnection;

const startServer = async () => {
  try {
    log("info", "🚀 Starting server...");

    // 🔄 Retry Connection Logic (Ensures MongoDB is Ready)
    let retries = 5;
    while (retries) {
      try {
        dbConnection = await connectToDatabase();
        log("success", " Successfully connected to MongoDB");
        break; // Exit loop on successful connection
      } catch (error) {
        retries--;
        log("error", ` MongoDB Connection Failed: ${error.message}`);
        if (!retries) {
          log("critical", " All retries failed. Exiting...");
          process.exit(1);
        }
        log(
          "warning",
          ` Retrying in 5 seconds... (${retries} attempts left)`
        );
        await new Promise((res) => setTimeout(res, 5000));
      }
    }

    // 🚀 Start Express Server
    server = app.listen(port, () => {
      log("success", ` Server running at: http://localhost:${port}`);
    });

    // 🛑 Handle Graceful Shutdown for Cloud Environments
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("uncaughtException", handleUncaughtErrors);
    process.on("unhandledRejection", handleUnhandledRejections);
  } catch (error) {
    log("critical", ` Fatal Error Starting Server: ${error.message}`);
    process.exit(1);
  }
};

// 🛑 Graceful Shutdown Function (Ensures Clean Exit)
const shutdown = async () => {
  log("warning", " Initiating graceful shutdown...");

  // 🛠 Close Database Connection
  if (dbConnection) {
    try {
      await dbConnection.close();
      log("success", " MongoDB connection closed.");
    } catch (error) {
      log("error", ` Error closing MongoDB: ${error.message}`);
    }
  }

  // 🛠 Close Server
  if (server) {
    try {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      log("success", " Server shut down successfully.");
    } catch (error) {
      log("error", ` Error shutting down server: ${error.message}`);
    }
  }

  log("info", "👋 Process exiting.");
  process.exit(0);
};

// ❌ Handle Uncaught Errors
const handleUncaughtErrors = (error) => {
  log("critical", ` Uncaught Exception: ${error.message}`);
  log("critical", error.stack);
  shutdown();
};

// ❌ Handle Unhandled Promise Rejections
const handleUnhandledRejections = (reason, promise) => {
  log("critical", " Unhandled Promise Rejection:");
  log("critical", reason);
  shutdown();
};

// 🚀 Start the server
startServer();
