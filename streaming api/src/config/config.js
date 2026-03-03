export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 9000,
    host: process.env.HOST || "0.0.0.0",
    environment: process.env.NODE_ENV || "development",
  },

  // SSL/TLS configuration
  ssl: {
    keyPath: "./cert/cert.key",
    certPath: "./cert/cert.crt",
  },

  // CORS configuration
  cors: {
    origins: "*",
    methods: ["GET", "POST"],
  },

  // Socket.IO configuration
  socketIO: {
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8, // 100 MB for large ICE candidates
    transports: ["websocket", "polling"],
  },

  // Camera configuration
  cameras: {
    allowedIds: ["front", "back"],
    connectionTimeout: 30000, // 30 seconds
    heartbeatInterval: 10000, // 10 seconds
  },

  // WebRTC configuration
  webrtc: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    enableColors: true,
    enableTimestamp: true,
  },
};

export default config;
