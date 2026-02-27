/**
 * WebRTC Signaling Server for CCTV System
 * Production-grade implementation with Socket.IO
 */

import fs from "fs";
import https from "https";
import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import { config } from "./config/config.js";
import logger from "./utils/logger.js";
import { SignalingHandler } from "./signaling/signalingHandler.js";
import cameraManager from "./signaling/cameraManager.js";

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Health check endpoint
app.get("/health", (req, res) => {
  const status = cameraManager.getAllCamerasStatus();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    cameras: status,
    uptime: process.uptime(),
  });
});

// API endpoint to get camera status
app.get("/api/cameras/status", (req, res) => {
  const status = cameraManager.getAllCamerasStatus();
  res.json(status);
});

// Create HTTPS server
let server;
try {
  const key = fs.readFileSync(config.ssl.keyPath);
  const cert = fs.readFileSync(config.ssl.certPath);

  server = https.createServer({ key, cert }, app);
  logger.info("HTTPS server initialized with SSL certificates");
} catch (error) {
  logger.error("Failed to load SSL certificates", { error: error.message });
  logger.warn("Falling back to HTTP server (not recommended for production)");

  const http = await import("http");
  server = http.createServer(app);
}

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // Check if origin matches any allowed pattern
      const isAllowed = config.cors.origins.some((pattern) => {
        if (pattern instanceof RegExp) {
          // Pattern is a RegExp
          return pattern.test(origin);
        }
        // Pattern is a string - convert to regex
        const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
        return new RegExp(`^${regexPattern}$`).test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn("CORS request blocked", { origin });
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: config.cors.methods,
    credentials: true,
  },
  ...config.socketIO,
});

// Initialize signaling handler
const signalingHandler = new SignalingHandler(io);

// Handle socket connections
io.on("connection", (socket) => {
  signalingHandler.handleConnection(socket);
});

// Start periodic tasks
signalingHandler.startPeriodicTasks();

// Start server
server.listen(config.server.port, config.server.host, () => {
  logger.info("═══════════════════════════════════════════════════════");
  logger.info("  WebRTC Signaling Server Started");
  logger.info("═══════════════════════════════════════════════════════");
  logger.info(`  Environment: ${config.server.environment}`);
  logger.info(`  Host: ${config.server.host}`);
  logger.info(`  Port: ${config.server.port}`);
  logger.info(
    `  Protocol: ${server instanceof https.Server ? "HTTPS" : "HTTP"}`,
  );
  logger.info(
    `  Camera Client: https://localhost:${config.server.port}/camera-client.html`,
  );
  logger.info("═══════════════════════════════════════════════════════");
});

// Graceful shutdown
const shutdown = () => {
  logger.info("Shutting down server...");

  io.close(() => {
    logger.info("Socket.IO connections closed");
  });

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection", { reason, promise });
});
