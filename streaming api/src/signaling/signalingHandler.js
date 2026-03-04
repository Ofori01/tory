import logger from "../utils/logger.js";
import cameraManager from "./cameraManager.js";
import { config } from "../config/config.js";

export class SignalingHandler {
  constructor(io) {
    this.io = io;
  }

  /**
   * Initialize socket event handlers for a client connection
   */
  handleConnection(socket) {
    logger.info("Client connected", { socketId: socket.id.substring(0, 8) });

    // Camera registration
    socket.on("camera:register", (data) =>
      this.handleCameraRegister(socket, data),
    );

    // Viewer joining
    socket.on("viewer:join", (data) => this.handleViewerJoin(socket, data));

    // WebRTC signaling
    socket.on("webrtc:offer", (data) => this.handleOffer(socket, data));
    socket.on("webrtc:answer", (data) => this.handleAnswer(socket, data));
    socket.on("webrtc:ice-candidate", (data) =>
      this.handleIceCandidate(socket, data),
    );

    // Heartbeat
    socket.on("heartbeat", (data) => this.handleHeartbeat(socket, data));

    // Status requests
    socket.on("cameras:status", () => this.handleStatusRequest(socket));

    // Disconnection
    socket.on("disconnect", () => this.handleDisconnect(socket));

    // Error handling
    socket.on("error", (error) => this.handleError(socket, error));
  }

  /**
   * Handle camera registration
   */
  handleCameraRegister(socket, data) {
    try {
      const { cameraId, metadata } = data;

      if (!cameraId) {
        socket.emit("error", { message: "Camera ID is required" });
        return;
      }

      // Register the camera
      cameraManager.registerCamera(cameraId, socket.id, metadata);

      // Acknowledge registration
      socket.emit("camera:registered", {
        cameraId,
        socketId: socket.id,
        webrtcConfig: config.webrtc,
      });

      // Notify all clients about camera status change
      this.broadcastCameraStatus();

      logger.info(`Camera ${cameraId} registered successfully`, {
        socketId: socket.id.substring(0, 8),
      });

      // Notify camera about any waiting viewers
      const waitingViewers = cameraManager.getViewers(cameraId);
      if (waitingViewers.length > 0) {
        logger.info(
          `Notifying camera ${cameraId} about ${waitingViewers.length} waiting viewer(s)`,
        );

        waitingViewers.forEach((viewerSocketId) => {
          socket.emit("viewer:connected", {
            viewerSocketId,
            cameraId,
          });
          logger.info(
            `Sent viewer:connected to camera for viewer ${viewerSocketId.substring(0, 8)}`,
          );
        });
      }
    } catch (error) {
      logger.error("Error registering camera", { error: error.message });
      socket.emit("error", { message: error.message });
    }
  }

  /**
   * Handle viewer joining to watch a camera
   */
  handleViewerJoin(socket, data) {
    try {
      const { cameraId } = data;

      if (!cameraId) {
        socket.emit("error", { message: "Camera ID is required" });
        return;
      }

      if (!config.cameras.allowedIds.includes(cameraId)) {
        socket.emit("error", { message: "Invalid camera ID" });
        return;
      }

      // Add viewer
      cameraManager.addViewer(cameraId, socket.id);

      const isOnline = cameraManager.isCameraOnline(cameraId);

      // Acknowledge join
      socket.emit("viewer:joined", {
        cameraId,
        cameraOnline: isOnline,
        webrtcConfig: config.webrtc,
      });

      // If camera is online, notify the camera about new viewer
      if (isOnline) {
        const camera = cameraManager.getCamera(cameraId);

        logger.info(`📹 Notifying camera ${cameraId} about new viewer`, {
          viewerSocketId: socket.id.substring(0, 8),
          cameraSocketId: camera.socketId.substring(0, 8),
        });

        this.io.to(camera.socketId).emit("viewer:connected", {
          viewerSocketId: socket.id,
          cameraId,
        });

        logger.info(`Viewer joined camera ${cameraId}`, {
          viewerSocketId: socket.id.substring(0, 8),
          cameraSocketId: camera.socketId.substring(0, 8),
        });
      } else {
        logger.info(`Viewer joined offline camera ${cameraId}`, {
          viewerSocketId: socket.id.substring(0, 8),
        });
      }
    } catch (error) {
      logger.error("Error handling viewer join", { error: error.message });
      socket.emit("error", { message: error.message });
    }
  }

  /**
   * Handle WebRTC offer (from camera to viewer)
   */
  handleOffer(socket, data) {
    try {
      const { offer, targetSocketId } = data;
      const cameraId = cameraManager.getCameraId(socket.id);

      logger.info(`WebRTC offer received from camera ${cameraId}`, {
        cameraSocketId: socket.id.substring(0, 8),
        targetSocketId: targetSocketId?.substring(0, 8),
      });

      if (!cameraId) {
        logger.error("Offer from unregistered camera");
        socket.emit("error", { message: "Camera not registered" });
        return;
      }

      if (!targetSocketId || !offer) {
        logger.error("Missing targetSocketId or offer");
        socket.emit("error", {
          message: "targetSocketId and offer are required",
        });
        return;
      }

      // Forward offer to the target viewer
      this.io.to(targetSocketId).emit("webrtc:offer", {
        offer,
        cameraId,
        cameraSocketId: socket.id,
      });

      logger.info(`✅ Offer forwarded from camera ${cameraId} to viewer`, {
        cameraSocketId: socket.id.substring(0, 8),
        viewerSocketId: targetSocketId.substring(0, 8),
      });
    } catch (error) {
      logger.error("Error handling offer", { error: error.message });
      socket.emit("error", { message: error.message });
    }
  }

  /**
   * Handle WebRTC answer (from viewer to camera)
   */
  handleAnswer(socket, data) {
    try {
      const { answer, cameraSocketId } = data;

      if (!cameraSocketId || !answer) {
        socket.emit("error", {
          message: "cameraSocketId and answer are required",
        });
        return;
      }

      const cameraId = cameraManager.getCameraId(cameraSocketId);

      if (!cameraId) {
        socket.emit("error", { message: "Camera not found" });
        return;
      }

      // Forward answer to the camera
      this.io.to(cameraSocketId).emit("webrtc:answer", {
        answer,
        viewerSocketId: socket.id,
      });

      logger.debug(`Answer forwarded from viewer to camera ${cameraId}`, {
        viewerSocketId: socket.id.substring(0, 8),
        cameraSocketId: cameraSocketId.substring(0, 8),
      });
    } catch (error) {
      logger.error("Error handling answer", { error: error.message });
      socket.emit("error", { message: error.message });
    }
  }

  /**
   * Handle ICE candidate exchange (bidirectional)
   */
  handleIceCandidate(socket, data) {
    try {
      const { candidate, targetSocketId } = data;

      if (!targetSocketId || !candidate) {
        socket.emit("error", {
          message: "targetSocketId and candidate are required",
        });
        return;
      }

      // Forward ICE candidate to target
      this.io.to(targetSocketId).emit("webrtc:ice-candidate", {
        candidate,
        senderSocketId: socket.id,
      });

      logger.debug("ICE candidate forwarded", {
        fromSocket: socket.id.substring(0, 8),
        toSocket: targetSocketId.substring(0, 8),
      });
    } catch (error) {
      logger.error("Error handling ICE candidate", { error: error.message });
    }
  }

  /**
   * Handle heartbeat from cameras
   */
  handleHeartbeat(socket, data) {
    const cameraId = cameraManager.getCameraId(socket.id);

    logger.info(
      `💓 Heartbeat received from socket ${socket.id.substring(0, 8)}`,
      { cameraId },
    );

    if (cameraId) {
      cameraManager.updateHeartbeat(cameraId);
      socket.emit("heartbeat:ack", { timestamp: Date.now() });
    } else {
      logger.warn(`Heartbeat from unknown socket ${socket.id.substring(0, 8)}`);
    }
  }

  /**
   * Handle status request
   */
  handleStatusRequest(socket) {
    const status = cameraManager.getAllCamerasStatus();
    socket.emit("cameras:status", status);
  }

  /**
   * Handle disconnection
   */
  handleDisconnect(socket) {
    // Check if this was a camera
    const cameraId = cameraManager.unregisterCamera(socket.id);

    if (cameraId) {
      // Notify all viewers of this camera
      const viewers = cameraManager.getViewers(cameraId);
      viewers.forEach((viewerSocketId) => {
        this.io.to(viewerSocketId).emit("camera:disconnected", { cameraId });
      });

      logger.info(`Camera ${cameraId} disconnected`, {
        socketId: socket.id.substring(0, 8),
        affectedViewers: viewers.length,
      });

      this.broadcastCameraStatus();
    }

    // Remove as viewer
    const removedFrom = cameraManager.removeViewer(socket.id);
    if (removedFrom.length > 0) {
      logger.info(
        `Viewer disconnected from cameras: ${removedFrom.join(", ")}`,
        {
          socketId: socket.id.substring(0, 8),
        },
      );
    }

    logger.info("Client disconnected", { socketId: socket.id.substring(0, 8) });
  }

  /**
   * Handle errors
   */
  handleError(socket, error) {
    logger.error("Socket error", {
      socketId: socket.id.substring(0, 8),
      error: error.message || error,
    });
  }

  /**
   * Broadcast camera status to all connected clients
   */
  broadcastCameraStatus() {
    const status = cameraManager.getAllCamerasStatus();
    this.io.emit("cameras:status", status);
  }

  /**
   * Start periodic tasks (heartbeat checks, etc.)
   */
  startPeriodicTasks() {
    // Check for stale connections every 30 seconds
    setInterval(() => {
      const staleCameras = cameraManager.checkStaleConnections();

      staleCameras.forEach((cameraId) => {
        const camera = cameraManager.getCamera(cameraId);
        if (camera) {
          // Force disconnect stale camera
          const socket = this.io.sockets.sockets.get(camera.socketId);
          if (socket) {
            socket.disconnect(true);
          }
        }
      });
    }, 30000);

    logger.info("Periodic tasks started");
  }
}

export default SignalingHandler;
