/**
 * Camera Manager
 * Manages camera registration, state tracking, and lifecycle
 */

import { config } from "../config/config.js";
import logger from "../utils/logger.js";

class CameraManager {
  constructor() {
    // Map: cameraId -> { socketId, connectedAt, lastHeartbeat, metadata }
    this.cameras = new Map();

    // Map: socketId -> cameraId (reverse lookup)
    this.socketToCamera = new Map();

    // Map: cameraId -> Set of viewer socketIds
    this.viewers = new Map();

    // Initialize viewers map for each camera
    config.cameras.allowedIds.forEach((cameraId) => {
      this.viewers.set(cameraId, new Set());
    });
  }

  /**
   * Register a camera with the system
   */
  registerCamera(cameraId, socketId, metadata = {}) {
    if (!config.cameras.allowedIds.includes(cameraId)) {
      throw new Error(
        `Invalid camera ID: ${cameraId}. Allowed: ${config.cameras.allowedIds.join(", ")}`,
      );
    }

    // Disconnect existing camera with same ID
    if (this.cameras.has(cameraId)) {
      const existingCamera = this.cameras.get(cameraId);
      logger.warn(
        `Camera ${cameraId} already registered. Replacing old connection.`,
        {
          oldSocketId: existingCamera.socketId.substring(0, 8),
          newSocketId: socketId.substring(0, 8),
        },
      );
    }

    const cameraData = {
      socketId,
      connectedAt: Date.now(),
      lastHeartbeat: Date.now(),
      metadata: {
        userAgent: metadata.userAgent || "unknown",
        deviceType: metadata.deviceType || "unknown",
        ...metadata,
      },
    };

    this.cameras.set(cameraId, cameraData);
    this.socketToCamera.set(socketId, cameraId);

    logger.info(`Camera registered: ${cameraId}`, {
      socketId: socketId.substring(0, 8),
      metadata: cameraData.metadata,
    });

    return cameraData;
  }

  /**
   * Unregister a camera
   */
  unregisterCamera(socketId) {
    const cameraId = this.socketToCamera.get(socketId);

    if (!cameraId) {
      return null;
    }

    this.cameras.delete(cameraId);
    this.socketToCamera.delete(socketId);

    logger.info(`Camera unregistered: ${cameraId}`, {
      socketId: socketId.substring(0, 8),
    });

    return cameraId;
  }

  /**
   * Add a viewer for a specific camera
   */
  addViewer(cameraId, viewerSocketId) {
    if (!this.viewers.has(cameraId)) {
      this.viewers.set(cameraId, new Set());
    }

    this.viewers.get(cameraId).add(viewerSocketId);

    logger.debug(`Viewer added to camera ${cameraId}`, {
      viewerSocketId: viewerSocketId.substring(0, 8),
      totalViewers: this.viewers.get(cameraId).size,
    });
  }

  /**
   * Remove a viewer
   */
  removeViewer(viewerSocketId) {
    let removedFrom = [];

    this.viewers.forEach((viewerSet, cameraId) => {
      if (viewerSet.has(viewerSocketId)) {
        viewerSet.delete(viewerSocketId);
        removedFrom.push(cameraId);
      }
    });

    if (removedFrom.length > 0) {
      logger.debug(`Viewer removed from cameras: ${removedFrom.join(", ")}`, {
        viewerSocketId: viewerSocketId.substring(0, 8),
      });
    }

    return removedFrom;
  }

  /**
   * Get viewers for a specific camera
   */
  getViewers(cameraId) {
    return Array.from(this.viewers.get(cameraId) || []);
  }

  /**
   * Get camera by ID
   */
  getCamera(cameraId) {
    return this.cameras.get(cameraId);
  }

  /**
   * Get camera ID by socket ID
   */
  getCameraId(socketId) {
    return this.socketToCamera.get(socketId);
  }

  /**
   * Check if camera is online
   */
  isCameraOnline(cameraId) {
    return this.cameras.has(cameraId);
  }

  /**
   * Update camera heartbeat
   */
  updateHeartbeat(cameraId) {
    const camera = this.cameras.get(cameraId);
    if (camera) {
      camera.lastHeartbeat = Date.now();
    }
  }

  /**
   * Get all cameras status
   */
  getAllCamerasStatus() {
    const status = {};

    config.cameras.allowedIds.forEach((cameraId) => {
      const camera = this.cameras.get(cameraId);
      status[cameraId] = {
        online: !!camera,
        viewers: this.viewers.get(cameraId)?.size || 0,
        connectedAt: camera?.connectedAt || null,
        lastHeartbeat: camera?.lastHeartbeat || null,
        metadata: camera?.metadata || null,
      };
    });

    return status;
  }

  /**
   * Check for stale connections (no heartbeat)
   */
  checkStaleConnections() {
    const now = Date.now();
    const staleThreshold = config.cameras.connectionTimeout;
    const staleCameras = [];

    this.cameras.forEach((camera, cameraId) => {
      if (now - camera.lastHeartbeat > staleThreshold) {
        staleCameras.push(cameraId);
        logger.warn(`Stale camera connection detected: ${cameraId}`, {
          lastHeartbeat: new Date(camera.lastHeartbeat).toISOString(),
        });
      }
    });

    return staleCameras;
  }
}

// Singleton instance
export const cameraManager = new CameraManager();
export default cameraManager;
